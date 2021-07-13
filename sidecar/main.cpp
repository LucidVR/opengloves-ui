#include "main.h"

#include <iostream>
#include <string>
#include "json.hpp"
#include <openvr.h>
#include <iomanip>

int GetSettings() {
	std::string s;
	std::getline(std::cin >> std::ws, s);
	try {
		auto json = nlohmann::json::parse(s, nullptr, true, true);

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
	}
	catch (nlohmann::json::exception& e)
	{
		std::cerr << "Error decoding JSON! What: " << e.what() << std::endl;
		return 0;
	}

	return 0;
}

int SetSettings() {
	std::string s;
	std::getline(std::cin >> std::ws, s);

	try
	{
		auto json = nlohmann::json::parse(s, nullptr, true, true);
		for (auto& el : json.items())
		{
			for (auto& el2 : el.value().items())
			{
				vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;

				//make sure we don't have a title
				if (el2.key().find("__") != std::string::npos) continue;

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
				case nlohmann::json::value_t::number_integer:
					vr::VRSettings()->SetInt32(el.key().c_str(), el2.key().c_str(), el2.value().get<int>(), &err);
					break;
				}

				if (err != vr::EVRSettingsError::VRSettingsError_None) {
					std::cerr << "Error setting configuration property. Section: " << el.key() << " Key: " << el2.key() << " Value: " << el2.value() << std::endl;
				}
			}
		}
	}
	catch (nlohmann::json::exception& e)
	{
		std::cerr << "Error decoding JSON! What: " << e.what() << std::endl;
		return 0;
	}

	std::cout << "Success saving configuration" << std::endl;

	vr::VR_Shutdown();

	return 0;
}

int main() {
	vr::EVRInitError error;

	VR_Init(&error, vr::VRApplication_Utility);

	if (error != vr::EVRInitError::VRInitError_None) {
		std::cerr << "OpenVR Init Error" << std::endl;
		return 0;
	}

	std::string s;

	std::cin >> s;

	if (s == "get") {
		return GetSettings();
	}
	else if (s == "set") {
		return SetSettings();
	}
}