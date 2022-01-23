//clang-format off
#define CROW_MAIN
#define CROW_LOG_LEVEL 0
#include "crow_all.h"

//clang-format on

#include <windows.h>

#include <iomanip>
#include <iostream>
#include <string>

#include "json.hpp"
#include "openvr.h"

void AddResponseHeaders(crow::response& res) {
  res.add_header("Access-Control-Allow-Origin", "*");
  res.add_header("Access-Control-Allow-Headers", "Content-Type");
}

static std::string GetLastErrorAsString() {
  const DWORD errorMessageId = ::GetLastError();
  if (errorMessageId == 0) return std::string();

  LPSTR messageBuffer = nullptr;
  const size_t size = FormatMessageA(FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM | FORMAT_MESSAGE_IGNORE_INSERTS, nullptr, errorMessageId,
                                     MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT), reinterpret_cast<LPSTR>(&messageBuffer), 0, nullptr);

  std::string message(messageBuffer, size);

  LocalFree(messageBuffer);

  return message;
}

crow::response GetSettings(nlohmann::json& json) {
  for (auto& el : json.items()) {
    const std::string& s_sectionName = el.key();
    const char* c_sectionName = s_sectionName.c_str();

    for (auto& el2 : el.value().items()) {
      const std::string& s_keyName = el2.key();
      const char* c_keyName = s_keyName.c_str();
      const nlohmann::json& value = el2.value();

      // Skip __title/__type/etc. fields
      if (s_keyName.find("__") != std::string::npos) continue;

      try {
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
      } catch (nlohmann::json::exception e) {
        return crow::response{500, "Error parsing json: " + std::string(e.what())};
      }
    }
  }

  return crow::response{200, json.dump()};
}

crow::response SetSettings(const nlohmann::json& json) {
  for (auto& el : json.items()) {
    const std::string& s_sectionName = el.key();
    const char* c_sectionName = s_sectionName.c_str();

    for (auto& el2 : el.value().items()) {
      const std::string& s_keyName = el2.key();
      const char* c_keyName = s_keyName.c_str();
      const nlohmann::json& value = el2.value();

      // Skip __title/__type/etc. fields
      if (s_keyName.find("__") != std::string::npos) continue;

      try {
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
            std::stringstream ss;
            ss << "Error finding configuration property value of key1: " << s_sectionName << " key2: " << s_keyName << " value: " << value.type_name() << std::endl;

            return crow::response{500, ss.str()};
        }

        if (err != vr::EVRSettingsError::VRSettingsError_None) {
          std::stringstream ss;
          ss << "Error setting configuration property. Section: " << s_sectionName << " Key: " << s_keyName << " Value: " << value << std::endl;

          return crow::response{500, ss.str()};
        }
      } catch (nlohmann::json::exception e) {
        return crow::response{500, e.what()};
      }
    }
  }

  return crow::response{200, "Successfully saved settings"};
}

template <typename T>
static bool ConnectAndSendPipe(const std::string& pipeName, T& data) {
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

struct PoseCalibrationData {
  PoseCalibrationData(bool start) : start(start){};
  uint8_t start;
};

crow::response PoseCalibration(const nlohmann::json& json) {
  const bool rightHand = json["right_hand"].get<bool>();
  const bool start = json["start"].get<bool>();

  PoseCalibrationData data(start);

  const bool success = ConnectAndSendPipe("\\\\.\\pipe\\vrapplication\\functions\\autocalibrate\\" + std::string(rightHand ? "right" : "left"), data);

  if (success) {
    return crow::response{200, "Successfully set pose calibration"};
  }

  std::stringstream ss;
  ss << "Failed to send pose calibration message" << std::endl;
  ss << "Error: " << GetLastErrorAsString() << std::endl;
  return {500, ss.str()};
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

crow::response ServoTest(const nlohmann::json& json) {
  const bool rightHand = json["right_hand"].get<bool>();
  const bool extend = json["extend"].get<bool>();

  const short setCurl = extend ? 1000 : 0;

  VRFFBData_t data(setCurl, setCurl, setCurl, setCurl, setCurl);

  const bool success = ConnectAndSendPipe("\\\\.\\pipe\\vrapplication\\ffb\\curl\\" + std::string(rightHand ? "right" : "left"), data);

  if (success) {
    return {200, "Successfully activated servos"};
  }

  std::stringstream ss;
  ss << "Error! Please make sure that SteamVR is running and the driver is enabled." << std::endl;
  ss << "Error: " << GetLastErrorAsString() << std::endl;

  return {500, ss.str()};
}

vr::EVRInitError InitOpenVR() {
  vr::EVRInitError error;
  VR_Init(&error, vr::VRApplication_Utility);

  return error;
}

std::string GetOpenVRErrorAsString(vr::EVRInitError err) {
  switch (err) {
    case 108:
    case 126:
      return "A HMD was not found. Please plug it in before trying to use the app.";
    default: {
      std::stringstream ss;
      ss << "Unknown Error: " << err << ". Please kill SteamVR (VRServer.exe) in task manager and try again.";

      return ss.str();
    }
  }
}

int main() {
  vr::EVRInitError initErr = InitOpenVR();
  if (initErr != vr::EVRInitError::VRInitError_None) {
    std::cerr << GetOpenVRErrorAsString(initErr) << std::endl;
    return 1;
  }

  std::cout << "initialised" << std::endl;

  crow::SimpleApp app;

  CROW_ROUTE(app, "/settings/get").methods(crow::HTTPMethod::Post)([](const crow::request& req) {
    auto json = nlohmann::json::parse(req.body, nullptr, true, true);

    crow::response res = GetSettings(json);
    AddResponseHeaders(res);
    return res;
  });

  CROW_ROUTE(app, "/settings/set").methods(crow::HTTPMethod::Post)([](const crow::request& req) {
    auto json = nlohmann::json::parse(req.body, nullptr, true, true);

    crow::response res = SetSettings(json);
    AddResponseHeaders(res);
    return res;
  });

  CROW_ROUTE(app, "/functions/pose_calibration").methods(crow::HTTPMethod::Post)([](const crow::request& req) {
    auto json = nlohmann::json::parse(req.body, nullptr, true, true);

    crow::response res = PoseCalibration(json);
    AddResponseHeaders(res);
    return res;
  });

  CROW_ROUTE(app, "/functions/servo_test").methods(crow::HTTPMethod::Post)([](const crow::request& req) {
    auto json = nlohmann::json::parse(req.body, nullptr, true, true);

    crow::response res = ServoTest(json);
    AddResponseHeaders(res);
    return res;
  });

  CROW_ROUTE(app, "/")([]() { return "Pong"; });

  app.port(18080).multithreaded().run();
}