#include "main.h"

#include <iostream>
#include <string>
#include "json.hpp"
#include <openvr.h>
#include <iomanip>
#include <windows.h>

int GetSettings(nlohmann::json& json) {

	for (auto& el : json.items())
	{
		for (auto& el2 : el.value().items())
		{
			vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;

			//make sure we don't have a title
			if (el2.key().find("__") != std::string::npos) continue;

			switch (el2.value().type()) {
			case nlohmann::json::value_t::string: {
				char result[256];
				vr::VRSettings()->GetString(el.key().c_str(), el2.key().c_str(), result, sizeof(result), &err);
				json[el.key()][el2.key()] = std::string(result);
				break;
			}
			case nlohmann::json::value_t::boolean: {
				bool result = vr::VRSettings()->GetBool(el.key().c_str(), el2.key().c_str(), &err);
				json[el.key()][el2.key()] = result;
				break;
			}
			case nlohmann::json::value_t::number_float: {
				float result = vr::VRSettings()->GetFloat(el.key().c_str(), el2.key().c_str(), &err);
				json[el.key()][el2.key()] = result;
				break;
			}
			case nlohmann::json::value_t::number_unsigned:
			case nlohmann::json::value_t::number_integer: {
				int32_t result = vr::VRSettings()->GetInt32(el.key().c_str(), el2.key().c_str(), &err);
				json[el.key()][el2.key()] = result;
				break;
			}
			}
			if (err != vr::EVRSettingsError::VRSettingsError_None) {
				std::cerr << "Error getting configuration property. Section: " << el.key() << " Key: " << el2.key() << " Value: " << el2.value() << std::endl;
			}
		}
	}
	std::cout << json.dump() << std::endl;

	return 0;
}

int SetSettings(const nlohmann::json& json) {

	for (auto& el : json.items())
	{
		for (auto& el2 : el.value().items())
		{
			//make sure we don't have a title
			if (el2.key().find("__") != std::string::npos) continue;

			vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;

			switch (el2.value().type()) {
			case nlohmann::json::value_t::string:
				vr::VRSettings()->SetString(el.key().c_str(), el2.key().c_str(), el2.value().get<std::string>().c_str(), &err);
				break;
			case nlohmann::json::value_t::boolean:
				vr::VRSettings()->SetBool(el.key().c_str(), el2.key().c_str(), el2.value().get<bool>(), &err);
				break;
			case nlohmann::json::value_t::number_float:
				vr::VRSettings()->SetFloat(el.key().c_str(), el2.key().c_str(), el2.value().get<float>(), &err);
				break;
			case nlohmann::json::value_t::number_unsigned:
			case nlohmann::json::value_t::number_integer:
				vr::VRSettings()->SetInt32(el.key().c_str(), el2.key().c_str(), el2.value().get<int>(), &err);
				break;
			default:
				std::cerr << "Error finding configuration property value of key1: " << el.key().c_str() << " key2: " << el2.key().c_str() << " value: " << el2.value().type_name() << std::endl;
			}

			if (err != vr::EVRSettingsError::VRSettingsError_None) {
				std::cerr << "Error setting configuration property. Section: " << el.key() << " Key: " << el2.key() << " Value: " << el2.value() << std::endl;
			}
		}
	}


	std::cout << "Success saving configuration" << std::endl;

	vr::VR_Shutdown();

	return 0;
}

bool ConnectAndSendPipe(const std::string& pipeName, LPCVOID data) {
	HANDLE pipeHandle;
	pipeHandle = CreateFile(pipeName.c_str(),  // pipe name
		GENERIC_READ |     // read and write access
		GENERIC_WRITE,
		0,              // no sharing
		NULL,           // default security attributes
		OPEN_EXISTING,  // opens existing pipe
		0,              // default attributes
		NULL);          // no template file

	if (GetLastError() != ERROR_PIPE_BUSY) {
		return false;
	}

	if (!WaitNamedPipe(pipeName.c_str(), 1000)) {
		return false;
	}

	DWORD dwWritten;

	WriteFile(pipeHandle, data, sizeof(data), &dwWritten, NULL);

	CloseHandle(pipeHandle);

	return true;
}

struct AutoCalibrationData {
	AutoCalibrationData(bool rightHand, bool start) {};
	bool rightHand;
	bool start;
};

int autoCalibrate(const nlohmann::json& json) {
	const bool rightHand = json["right_hand"].get<bool>();
	const bool start = json["start"].get<bool>();

	AutoCalibrationData data(rightHand, start);

	std::cout << "hi" << std::endl;
	if (ConnectAndSendPipe("\\\\.\\pipe\\vrapplication\\functions\\autocalibrate", (LPCVOID)&data)) {
		std::cout << "Successfully sent message" << std::endl;
		return 0;
	}
	std::cerr << "Failed to send message" << std::endl;
	return 1;
}

int main() {
	vr::EVRInitError error;

	VR_Init(&error, vr::VRApplication_Utility);

	if (error != vr::EVRInitError::VRInitError_None) {
		std::cerr << "OpenVR Init Error" << std::endl;
		return 0;
	}

	std::string s;

	std::getline(std::cin >> std::ws, s);

	try {
		auto json = nlohmann::json::parse(s, nullptr, true, true);

		const std::string type = json["type"].get<std::string>();


		if (type == "settings_get") {
			return GetSettings(json["data"]);
		}

		if (type == "settings_set") {
			return SetSettings(json["data"]);
		}

		if (type == "functions_autocalibrate") {
			return autoCalibrate(json["data"]);
		}

		std::cerr << "Could not find the operation type: " << type << std::endl;
	}
	catch (nlohmann::json::exception& e)
	{
		std::cerr << "Error decoding JSON! What: " << e.what() << std::endl;
		return 1;
	}

	return 1;
}