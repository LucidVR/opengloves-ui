#include "main.h"

#include <openvr.h>
#include <windows.h>

#include <iomanip>
#include <iostream>

static vr::EVRSettingsError TryGetSettings(nlohmann::json& json, bool removePrefix) {
  vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;
  for (auto& el : json.items()) {
    const std::string sectionNameString = el.key();
    const char* sectionName = sectionNameString.c_str();
    bool sectionNameHasPrefix = sectionNameString.find(SECTION_NAME_PREFIX) == 0;
    const std::string sectionNameWithoutPrefixString = sectionNameHasPrefix ? sectionNameString.substr(SECTION_NAME_PREFIX.length()) : sectionNameString;
    const char* sectionNameWithoutPrefix = sectionNameWithoutPrefixString.c_str();

    for (auto& el2 : el.value().items()) {
      const std::string keyNameString = el2.key();
      const char* keyName = keyNameString.c_str();

      // Skip __title/__type/etc. fields
      if (keyNameString.find("__") != std::string::npos) continue;

      switch (el2.value().type()) {
        case nlohmann::json::value_t::string: {
          char result[256];
          vr::VRSettings()->GetString(removePrefix ? sectionNameWithoutPrefix : sectionName, keyName, result, sizeof(result), &err);
          if (err == vr::EVRSettingsError::VRSettingsError_None)
            json[sectionNameString][keyNameString] = std::string(result);
          break;
        }
        case nlohmann::json::value_t::boolean: {
          bool result = vr::VRSettings()->GetBool(removePrefix ? sectionNameWithoutPrefix : sectionName, keyName, &err);
          if (err == vr::EVRSettingsError::VRSettingsError_None)
            json[sectionNameString][keyNameString] = result;
          break;
        }
        case nlohmann::json::value_t::number_float: {
          float result = vr::VRSettings()->GetFloat(removePrefix ? sectionNameWithoutPrefix : sectionName, keyName, &err);
          if (err == vr::EVRSettingsError::VRSettingsError_None)
            json[sectionNameString][keyNameString] = result;
          break;
        }
        case nlohmann::json::value_t::number_unsigned:
        case nlohmann::json::value_t::number_integer: {
          int32_t result = vr::VRSettings()->GetInt32(removePrefix ? sectionNameWithoutPrefix : sectionName, keyName, &err);
          if (err == vr::EVRSettingsError::VRSettingsError_None)
            json[sectionNameString][keyNameString] = result;
          break;
        }
      }
      if (err != vr::EVRSettingsError::VRSettingsError_None) {
        if (removePrefix)
          std::cerr << "Error getting configuration property. Section: " << sectionNameString << " Key: " << keyNameString << " Value: " << el2.value() << std::endl;
        return err;
      }
    }
  }
  return err;
}

int GetSettings(nlohmann::json& json) {
  vr::EVRSettingsError err = TryGetSettings(json, false);
  if (err != vr::EVRSettingsError::VRSettingsError_None)
    err = TryGetSettings(json, true);
  if (err == vr::EVRSettingsError::VRSettingsError_None)
  {
    std::cout << json.dump() << std::endl;
    return 0;
  }
  return 1;
}

int SetSettings(const nlohmann::json& json) {
  for (auto& el : json.items()) {
    const std::string sectionNameString = el.key();
    const char* sectionName = sectionNameString.c_str();

    for (auto& el2 : el.value().items()) {
      const std::string keyNameString = el2.key();
      const char* keyName = keyNameString.c_str();
      vr::EVRSettingsError err = vr::EVRSettingsError::VRSettingsError_None;

      // Skip __title/__type/etc. fields
      if (keyNameString.find("__") != std::string::npos) continue;

      switch (el2.value().type()) {
        case nlohmann::json::value_t::string:
          vr::VRSettings()->SetString(sectionName, keyName, el2.value().get<std::string>().c_str(), &err);
          break;
        case nlohmann::json::value_t::boolean:
          vr::VRSettings()->SetBool(sectionName, keyName, el2.value().get<bool>(), &err);
          break;
        case nlohmann::json::value_t::number_float:
          vr::VRSettings()->SetFloat(sectionName, keyName, el2.value().get<float>(), &err);
          break;
        case nlohmann::json::value_t::number_unsigned:
        case nlohmann::json::value_t::number_integer:
          vr::VRSettings()->SetInt32(sectionName, keyName, el2.value().get<int>(), &err);
          break;
        default:
          std::cerr << "Error finding configuration property value of key1: " << sectionNameString << " key2: " << keyNameString
                    << " value: " << el2.value().type_name() << std::endl;
          break;
      }

      if (err != vr::EVRSettingsError::VRSettingsError_None) {
        std::cerr << "Error setting configuration property. Section: " << sectionNameString << " Key: " << keyNameString << " Value: " << el2.value() << std::endl;
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
  bool start;
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

    std::cerr << "Could not find the operation type: " << type << std::endl;
  } catch (nlohmann::json::exception& e) {
    std::cerr << "Error decoding JSON! What: " << e.what() << std::endl;
    return 1;
  }

  return 1;
}