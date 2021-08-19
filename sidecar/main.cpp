#include "main.h"

#include <openvr.h>
#include <windows.h>

#include <iomanip>
#include <iostream>
#include <string>

#include "json.hpp"

int GetSettings(nlohmann::json& json) {
  for (auto& el : json.items()) {
    const std::string& s_sectionName = el.key();
    const char* c_sectionName = s_sectionName.c_str();

    for (auto& el2 : el.value().items()) {
      const std::string& s_keyName = el2.key();
      const char* c_keyName = s_keyName.c_str();
      const nlohmann::json& value = el2.value();

      // Skip __title/__type/etc. fields
      if (s_keyName.find("__") != std::string::npos) continue;

      vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;
      switch (value.type()) {
        case nlohmann::json::value_t::string: {
          char result[256];
          vr::VRSettings()->GetString(c_sectionName, c_keyName, result, sizeof(result), &err);
          json[s_sectionName][s_keyName] = std::string(result);
          break;
        }
        case nlohmann::json::value_t::boolean: {
          bool result = vr::VRSettings()->GetBool(c_sectionName, c_keyName, &err);
          json[s_sectionName][s_keyName] = result;
          break;
        }
        case nlohmann::json::value_t::number_float: {
          float result = vr::VRSettings()->GetFloat(c_sectionName, c_keyName, &err);
          json[s_sectionName][s_keyName] = result;
          break;
        }
        case nlohmann::json::value_t::number_unsigned:
        case nlohmann::json::value_t::number_integer: {
          int32_t result = vr::VRSettings()->GetInt32(c_sectionName, c_keyName, &err);
          json[s_sectionName][s_keyName] = result;
          break;
        }
      }

      if (err != vr::EVRSettingsError::VRSettingsError_None) {
        std::cerr << "Error getting configuration property. Section: " << s_sectionName << " Key: " << s_keyName << " Value: " << value << std::endl;
        return 1;
      }
    }
  }

  std::cout << json.dump() << std::endl;
  return 0;
}

int SetSettings(const nlohmann::json& json) {
  for (auto& el : json.items()) {
    const std::string& s_sectionName = el.key();
    const char* c_sectionName = s_sectionName.c_str();

    for (auto& el2 : el.value().items()) {
      const std::string& s_keyName = el2.key();
      const char* c_keyName = s_keyName.c_str();
      const nlohmann::json& value = el2.value();

      // Skip __title/__type/etc. fields
      if (s_keyName.find("__") != std::string::npos) continue;

      vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;
      switch (value.type()) {
        case nlohmann::json::value_t::string:
          vr::VRSettings()->SetString(c_sectionName, c_keyName, value.get<std::string>().c_str(), &err);
          break;
        case nlohmann::json::value_t::boolean:
          vr::VRSettings()->SetBool(c_sectionName, c_keyName, value.get<bool>(), &err);
          break;
        case nlohmann::json::value_t::number_float:
          vr::VRSettings()->SetFloat(c_sectionName, c_keyName, value.get<float>(), &err);
          break;
        case nlohmann::json::value_t::number_unsigned:
        case nlohmann::json::value_t::number_integer:
          vr::VRSettings()->SetInt32(c_sectionName, c_keyName, value.get<int>(), &err);
          break;
        default:
          std::cerr << "Error finding configuration property value of key1: " << s_sectionName << " key2: " << s_keyName << " value: " << value.type_name() << std::endl;
          return 1;
      }

      if (err != vr::EVRSettingsError::VRSettingsError_None) {
        std::cerr << "Error setting configuration property. Section: " << s_sectionName << " Key: " << s_keyName << " Value: " << value << std::endl;
        return 1;
      }
    }
  }

  std::cout << "Success saving configuration" << std::endl;

  vr::VR_Shutdown();

  return 0;
}

template <typename T>
static bool ConnectAndSendPipe(const std::string& pipeName, T data) {
  HANDLE pipeHandle;

  while (1) {
    pipeHandle = CreateFile(pipeName.c_str(), GENERIC_READ | GENERIC_WRITE, 0, NULL, OPEN_EXISTING, 0, NULL);

    if (pipeHandle != INVALID_HANDLE_VALUE) break;

    if (GetLastError() != ERROR_PIPE_BUSY) {
      return false;
    }

    if (!WaitNamedPipe(pipeName.c_str(), 1000)) {
      return false;
    }
  }

  DWORD dwWritten;

  WriteFile(pipeHandle, (LPCVOID)&data, sizeof(data), &dwWritten, NULL);

  CloseHandle(pipeHandle);

  return true;
}

struct AutoCalibrationData {
  AutoCalibrationData(bool start) : start(start){};
  uint8_t start;
};

int AutoCalibrate(const nlohmann::json& json) {
  const bool rightHand = json["right_hand"].get<bool>();
  const bool start = json["start"].get<bool>();

  AutoCalibrationData data(start);

  const bool success = ConnectAndSendPipe("\\\\.\\pipe\\vrapplication\\functions\\autocalibrate\\" + std::string(rightHand ? "right" : "left"), data);

  if (success) {
    std::cout << "Successfully sent message" << std::endl;
    return 0;
  }

  std::cerr << "Failed to send message" << std::endl;
  return 1;
}

struct VRFFBData_t {
  VRFFBData_t(short thumbCurl, short indexCurl, short middleCurl, short ringCurl, short pinkyCurl)
      : thumbCurl(thumbCurl), indexCurl(indexCurl), middleCurl(middleCurl), ringCurl(ringCurl), pinkyCurl(pinkyCurl){};

  short thumbCurl;
  short indexCurl;
  short middleCurl;
  short ringCurl;
  short pinkyCurl;
};

int ServoTest(const nlohmann::json& json) {
  const bool rightHand = json["right_hand"].get<bool>();
  const bool extend = json["extend"].get<bool>();

  const short setCurl = extend ? 1000 : 0;

  VRFFBData_t data(setCurl, setCurl, setCurl, setCurl, setCurl);

  const bool success = ConnectAndSendPipe("\\\\.\\pipe\\vrapplication\\ffb\\curl\\" + std::string(rightHand ? "right" : "left"), data);

  if (success) {
    std::cout << "Successfully activated force feedback" << std::endl;
    return 0;
  }

  std::cerr << "Failed to send force feedback message to pipe" << std::endl;
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
      return AutoCalibrate(json["data"]);
    }

    if (type == "functions_servotest") {
      return ServoTest(json["data"]);
    }

    std::cerr << "Could not find the operation type: " << type << std::endl;
  } catch (nlohmann::json::exception& e) {
    std::cerr << "Error decoding JSON! What: " << e.what() << std::endl;
    return 1;
  }

  return 1;
}