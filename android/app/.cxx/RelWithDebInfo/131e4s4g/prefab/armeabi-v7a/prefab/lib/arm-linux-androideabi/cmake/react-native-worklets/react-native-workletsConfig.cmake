if(NOT TARGET react-native-worklets::worklets)
add_library(react-native-worklets::worklets SHARED IMPORTED)
set_target_properties(react-native-worklets::worklets PROPERTIES
    IMPORTED_LOCATION "D:/Dipan/ReactNativeProject/SCM/SCMemorial/node_modules/react-native-worklets/android/build/intermediates/cxx/RelWithDebInfo/1c5d146h/obj/armeabi-v7a/libworklets.so"
    INTERFACE_INCLUDE_DIRECTORIES "D:/Dipan/ReactNativeProject/SCM/SCMemorial/node_modules/react-native-worklets/android/build/prefab-headers/worklets"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

