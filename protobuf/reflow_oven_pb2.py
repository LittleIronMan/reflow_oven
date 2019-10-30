# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: reflow_oven.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf.internal import enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


import importlib.util
spec = importlib.util.spec_from_file_location("nanopb_pb2", "../protobuf/nanopb/generator/proto/nanopb_pb2.py")
nanopb__pb2 = importlib.util.module_from_spec(spec)
spec.loader.exec_module(nanopb__pb2)


DESCRIPTOR = _descriptor.FileDescriptor(
  name='reflow_oven.proto',
  package='',
  syntax='proto3',
  serialized_options=None,
  serialized_pb=_b('\n\x11reflow_oven.proto\x1a\x0cnanopb.proto\"v\n\nPB_Command\x12\x1c\n\x07\x63mdType\x18\x01 \x01(\x0e\x32\x0b.PB_CmdType\x12\n\n\x02id\x18\x02 \x01(\r\x12\x17\n\x08priority\x18\x03 \x01(\rB\x05\x92?\x02\x38\x08\x12\x16\n\x07\x41\x43M_idx\x18\x04 \x01(\rB\x05\x92?\x02\x38\x08\x12\r\n\x05value\x18\x05 \x01(\r\"-\n\x07PB_Time\x12\x13\n\x0bunixSeconds\x18\x01 \x01(\r\x12\r\n\x05mills\x18\x02 \x01(\x02\"6\n\x0ePB_TempMeasure\x12\x16\n\x04time\x18\x01 \x01(\x0b\x32\x08.PB_Time\x12\x0c\n\x04temp\x18\x02 \x01(\x02\"X\n\x0ePB_TempProfile\x12\x1a\n\x0b\x63ountPoints\x18\x01 \x01(\rB\x05\x92?\x02\x38\x08\x12*\n\x04\x64\x61ta\x18\x02 \x03(\x0b\x32\x0f.PB_TempMeasureB\x0b\x92?\x02\x10\n\x92?\x03\x80\x01\x01\"N\n\x19PB_ResponseGetTempProfile\x12\x0f\n\x07success\x18\x01 \x01(\x08\x12 \n\x07profile\x18\x02 \x01(\x0b\x32\x0f.PB_TempProfile\"\xa3\x01\n\x0bPB_Response\x12\x1c\n\x07\x63mdType\x18\x01 \x01(\x0e\x32\x0b.PB_CmdType\x12\r\n\x05\x63mdId\x18\x02 \x01(\r\x12\x0f\n\x07success\x18\x03 \x01(\x08\x12 \n\tovenState\x18\x04 \x01(\x0e\x32\r.PB_OvenState\x12\x1c\n\x05\x65rror\x18\x05 \x01(\x0e\x32\r.PB_ErrorType\x12\x16\n\x04time\x18\x06 \x01(\x0b\x32\x08.PB_Time\"N\n\x12PB_SwitchOvenState\x12\x16\n\x04time\x18\x01 \x01(\x0b\x32\x08.PB_Time\x12 \n\tovenState\x18\x02 \x01(\x0e\x32\r.PB_OvenState\"\xc8\x01\n\x0ePB_ControlData\x12$\n\x0b\x63ontrolMode\x18\x01 \x01(\x0e\x32\x0f.PB_ControlMode\x12&\n\x0c\x63ontrolState\x18\x02 \x01(\x0e\x32\x10.PB_ControlState\x12\x10\n\x08isPaused\x18\x03 \x01(\x08\x12\x1b\n\tstartTime\x18\x04 \x01(\x0b\x32\x08.PB_Time\x12\x1d\n\x0b\x65lapsedTime\x18\x05 \x01(\x0b\x32\x08.PB_Time\x12\x1a\n\x08\x64uration\x18\x06 \x01(\x0b\x32\x08.PB_Time\"\xa4\x01\n\x12PB_FullControlData\x12(\n\x0fleadControlMode\x18\x01 \x01(\x0e\x32\x0f.PB_ControlMode\x12 \n\tovenState\x18\x02 \x01(\x0e\x32\r.PB_OvenState\x12\x16\n\x0e\x63onstTempValue\x18\x03 \x01(\x02\x12*\n\x04\x64\x61ta\x18\x04 \x03(\x0b\x32\x0f.PB_ControlDataB\x0b\x92?\x02\x10\x02\x92?\x03\x80\x01\x01*\xd0\x01\n\nPB_MsgType\x12\r\n\tUNDEFINED\x10\x00\x12\x07\n\x03\x43MD\x10\x01\x12\x0c\n\x08RESPONSE\x10\x02\x12\x1d\n\x19RESPONSE_GET_TEMP_PROFILE\x10\x03\x12\x10\n\x0cTEMP_MEASURE\x10\x04\x12\x19\n\x15RESPONSE_TEMP_MEASURE\x10\x05\x12\x12\n\x0e\x46INISH_PROGRAM\x10\x06\x12\x0e\n\nPLAIN_TEXT\x10\x07\x12\x15\n\x11SWITCH_OVEN_STATE\x10\x08\x12\x15\n\x11\x46ULL_CONTROL_DATA\x10\t*\xec\x01\n\nPB_CmdType\x12\x10\n\x0cGET_ALL_INFO\x10\x00\x12\r\n\tGET_STATE\x10\x01\x12\x0e\n\nHARD_RESET\x10\x02\x12\x19\n\x15\x43LIENT_REQUIRES_RESET\x10\x03\x12\r\n\tMANUAL_ON\x10\x04\x12\x0e\n\nMANUAL_OFF\x10\x05\x12\x17\n\x13MANUAL_KEEP_CURRENT\x10\x06\x12\x08\n\x04STOP\x10\x07\x12\t\n\x05START\x10\x08\x12\x0c\n\x08START_BG\x10\t\x12\x0c\n\x08SET_TIME\x10\n\x12\t\n\x05PAUSE\x10\x0b\x12\n\n\x06RESUME\x10\x0c\x12\x12\n\x0eSET_CONST_TEMP\x10\r*\x1f\n\x0cPB_OvenState\x12\x07\n\x03OFF\x10\x00\x12\x06\n\x02ON\x10\x01*[\n\x0ePB_ControlMode\x12\x0f\n\x0b\x44\x45\x46\x41ULT_OFF\x10\x00\x12\x17\n\x13\x46OLLOW_TEMP_PROFILE\x10\x01\x12\x13\n\x0fHOLD_CONST_TEMP\x10\x02\x12\n\n\x06MANUAL\x10\x03*<\n\x0fPB_ControlState\x12\x0c\n\x08\x44ISABLED\x10\x00\x12\x0e\n\nBACKGROUND\x10\x01\x12\x0b\n\x07\x45NABLED\x10\x02*q\n\x0cPB_ErrorType\x12\x08\n\x04NONE\x10\x00\x12\x1d\n\x19\x46\x41ULTY_TEMPERATURE_SENSOR\x10\x01\x12\x10\n\x0c\x46\x41ULTY_RELAY\x10\x02\x12\x13\n\x0fUNKNOWN_COMMAND\x10\x03\x12\x11\n\rUNKNOWN_ERROR\x10\x04\x62\x06proto3')
  ,
  dependencies=[nanopb__pb2.DESCRIPTOR,])

_PB_MSGTYPE = _descriptor.EnumDescriptor(
  name='PB_MsgType',
  full_name='PB_MsgType',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='UNDEFINED', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CMD', index=1, number=1,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='RESPONSE', index=2, number=2,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='RESPONSE_GET_TEMP_PROFILE', index=3, number=3,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='TEMP_MEASURE', index=4, number=4,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='RESPONSE_TEMP_MEASURE', index=5, number=5,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FINISH_PROGRAM', index=6, number=6,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='PLAIN_TEXT', index=7, number=7,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='SWITCH_OVEN_STATE', index=8, number=8,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FULL_CONTROL_DATA', index=9, number=9,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=1045,
  serialized_end=1253,
)
_sym_db.RegisterEnumDescriptor(_PB_MSGTYPE)

PB_MsgType = enum_type_wrapper.EnumTypeWrapper(_PB_MSGTYPE)
_PB_CMDTYPE = _descriptor.EnumDescriptor(
  name='PB_CmdType',
  full_name='PB_CmdType',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='GET_ALL_INFO', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='GET_STATE', index=1, number=1,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='HARD_RESET', index=2, number=2,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='CLIENT_REQUIRES_RESET', index=3, number=3,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='MANUAL_ON', index=4, number=4,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='MANUAL_OFF', index=5, number=5,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='MANUAL_KEEP_CURRENT', index=6, number=6,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='STOP', index=7, number=7,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='START', index=8, number=8,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='START_BG', index=9, number=9,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='SET_TIME', index=10, number=10,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='PAUSE', index=11, number=11,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='RESUME', index=12, number=12,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='SET_CONST_TEMP', index=13, number=13,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=1256,
  serialized_end=1492,
)
_sym_db.RegisterEnumDescriptor(_PB_CMDTYPE)

PB_CmdType = enum_type_wrapper.EnumTypeWrapper(_PB_CMDTYPE)
_PB_OVENSTATE = _descriptor.EnumDescriptor(
  name='PB_OvenState',
  full_name='PB_OvenState',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='OFF', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='ON', index=1, number=1,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=1494,
  serialized_end=1525,
)
_sym_db.RegisterEnumDescriptor(_PB_OVENSTATE)

PB_OvenState = enum_type_wrapper.EnumTypeWrapper(_PB_OVENSTATE)
_PB_CONTROLMODE = _descriptor.EnumDescriptor(
  name='PB_ControlMode',
  full_name='PB_ControlMode',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='DEFAULT_OFF', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FOLLOW_TEMP_PROFILE', index=1, number=1,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='HOLD_CONST_TEMP', index=2, number=2,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='MANUAL', index=3, number=3,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=1527,
  serialized_end=1618,
)
_sym_db.RegisterEnumDescriptor(_PB_CONTROLMODE)

PB_ControlMode = enum_type_wrapper.EnumTypeWrapper(_PB_CONTROLMODE)
_PB_CONTROLSTATE = _descriptor.EnumDescriptor(
  name='PB_ControlState',
  full_name='PB_ControlState',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='DISABLED', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='BACKGROUND', index=1, number=1,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='ENABLED', index=2, number=2,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=1620,
  serialized_end=1680,
)
_sym_db.RegisterEnumDescriptor(_PB_CONTROLSTATE)

PB_ControlState = enum_type_wrapper.EnumTypeWrapper(_PB_CONTROLSTATE)
_PB_ERRORTYPE = _descriptor.EnumDescriptor(
  name='PB_ErrorType',
  full_name='PB_ErrorType',
  filename=None,
  file=DESCRIPTOR,
  values=[
    _descriptor.EnumValueDescriptor(
      name='NONE', index=0, number=0,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FAULTY_TEMPERATURE_SENSOR', index=1, number=1,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='FAULTY_RELAY', index=2, number=2,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='UNKNOWN_COMMAND', index=3, number=3,
      serialized_options=None,
      type=None),
    _descriptor.EnumValueDescriptor(
      name='UNKNOWN_ERROR', index=4, number=4,
      serialized_options=None,
      type=None),
  ],
  containing_type=None,
  serialized_options=None,
  serialized_start=1682,
  serialized_end=1795,
)
_sym_db.RegisterEnumDescriptor(_PB_ERRORTYPE)

PB_ErrorType = enum_type_wrapper.EnumTypeWrapper(_PB_ERRORTYPE)
UNDEFINED = 0
CMD = 1
RESPONSE = 2
RESPONSE_GET_TEMP_PROFILE = 3
TEMP_MEASURE = 4
RESPONSE_TEMP_MEASURE = 5
FINISH_PROGRAM = 6
PLAIN_TEXT = 7
SWITCH_OVEN_STATE = 8
FULL_CONTROL_DATA = 9
GET_ALL_INFO = 0
GET_STATE = 1
HARD_RESET = 2
CLIENT_REQUIRES_RESET = 3
MANUAL_ON = 4
MANUAL_OFF = 5
MANUAL_KEEP_CURRENT = 6
STOP = 7
START = 8
START_BG = 9
SET_TIME = 10
PAUSE = 11
RESUME = 12
SET_CONST_TEMP = 13
OFF = 0
ON = 1
DEFAULT_OFF = 0
FOLLOW_TEMP_PROFILE = 1
HOLD_CONST_TEMP = 2
MANUAL = 3
DISABLED = 0
BACKGROUND = 1
ENABLED = 2
NONE = 0
FAULTY_TEMPERATURE_SENSOR = 1
FAULTY_RELAY = 2
UNKNOWN_COMMAND = 3
UNKNOWN_ERROR = 4



_PB_COMMAND = _descriptor.Descriptor(
  name='PB_Command',
  full_name='PB_Command',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='cmdType', full_name='PB_Command.cmdType', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='id', full_name='PB_Command.id', index=1,
      number=2, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='priority', full_name='PB_Command.priority', index=2,
      number=3, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=_b('\222?\0028\010'), file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='ACM_idx', full_name='PB_Command.ACM_idx', index=3,
      number=4, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=_b('\222?\0028\010'), file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='value', full_name='PB_Command.value', index=4,
      number=5, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=35,
  serialized_end=153,
)


_PB_TIME = _descriptor.Descriptor(
  name='PB_Time',
  full_name='PB_Time',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='unixSeconds', full_name='PB_Time.unixSeconds', index=0,
      number=1, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='mills', full_name='PB_Time.mills', index=1,
      number=2, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=155,
  serialized_end=200,
)


_PB_TEMPMEASURE = _descriptor.Descriptor(
  name='PB_TempMeasure',
  full_name='PB_TempMeasure',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='time', full_name='PB_TempMeasure.time', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='temp', full_name='PB_TempMeasure.temp', index=1,
      number=2, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=202,
  serialized_end=256,
)


_PB_TEMPPROFILE = _descriptor.Descriptor(
  name='PB_TempProfile',
  full_name='PB_TempProfile',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='countPoints', full_name='PB_TempProfile.countPoints', index=0,
      number=1, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=_b('\222?\0028\010'), file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='data', full_name='PB_TempProfile.data', index=1,
      number=2, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=_b('\222?\002\020\n\222?\003\200\001\001'), file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=258,
  serialized_end=346,
)


_PB_RESPONSEGETTEMPPROFILE = _descriptor.Descriptor(
  name='PB_ResponseGetTempProfile',
  full_name='PB_ResponseGetTempProfile',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='success', full_name='PB_ResponseGetTempProfile.success', index=0,
      number=1, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='profile', full_name='PB_ResponseGetTempProfile.profile', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=348,
  serialized_end=426,
)


_PB_RESPONSE = _descriptor.Descriptor(
  name='PB_Response',
  full_name='PB_Response',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='cmdType', full_name='PB_Response.cmdType', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='cmdId', full_name='PB_Response.cmdId', index=1,
      number=2, type=13, cpp_type=3, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='success', full_name='PB_Response.success', index=2,
      number=3, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='ovenState', full_name='PB_Response.ovenState', index=3,
      number=4, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='error', full_name='PB_Response.error', index=4,
      number=5, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='time', full_name='PB_Response.time', index=5,
      number=6, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=429,
  serialized_end=592,
)


_PB_SWITCHOVENSTATE = _descriptor.Descriptor(
  name='PB_SwitchOvenState',
  full_name='PB_SwitchOvenState',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='time', full_name='PB_SwitchOvenState.time', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='ovenState', full_name='PB_SwitchOvenState.ovenState', index=1,
      number=2, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=594,
  serialized_end=672,
)


_PB_CONTROLDATA = _descriptor.Descriptor(
  name='PB_ControlData',
  full_name='PB_ControlData',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='controlMode', full_name='PB_ControlData.controlMode', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='controlState', full_name='PB_ControlData.controlState', index=1,
      number=2, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='isPaused', full_name='PB_ControlData.isPaused', index=2,
      number=3, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='startTime', full_name='PB_ControlData.startTime', index=3,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='elapsedTime', full_name='PB_ControlData.elapsedTime', index=4,
      number=5, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='duration', full_name='PB_ControlData.duration', index=5,
      number=6, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=675,
  serialized_end=875,
)


_PB_FULLCONTROLDATA = _descriptor.Descriptor(
  name='PB_FullControlData',
  full_name='PB_FullControlData',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='leadControlMode', full_name='PB_FullControlData.leadControlMode', index=0,
      number=1, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='ovenState', full_name='PB_FullControlData.ovenState', index=1,
      number=2, type=14, cpp_type=8, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='constTempValue', full_name='PB_FullControlData.constTempValue', index=2,
      number=3, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='data', full_name='PB_FullControlData.data', index=3,
      number=4, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=_b('\222?\002\020\002\222?\003\200\001\001'), file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=878,
  serialized_end=1042,
)

_PB_COMMAND.fields_by_name['cmdType'].enum_type = _PB_CMDTYPE
_PB_TEMPMEASURE.fields_by_name['time'].message_type = _PB_TIME
_PB_TEMPPROFILE.fields_by_name['data'].message_type = _PB_TEMPMEASURE
_PB_RESPONSEGETTEMPPROFILE.fields_by_name['profile'].message_type = _PB_TEMPPROFILE
_PB_RESPONSE.fields_by_name['cmdType'].enum_type = _PB_CMDTYPE
_PB_RESPONSE.fields_by_name['ovenState'].enum_type = _PB_OVENSTATE
_PB_RESPONSE.fields_by_name['error'].enum_type = _PB_ERRORTYPE
_PB_RESPONSE.fields_by_name['time'].message_type = _PB_TIME
_PB_SWITCHOVENSTATE.fields_by_name['time'].message_type = _PB_TIME
_PB_SWITCHOVENSTATE.fields_by_name['ovenState'].enum_type = _PB_OVENSTATE
_PB_CONTROLDATA.fields_by_name['controlMode'].enum_type = _PB_CONTROLMODE
_PB_CONTROLDATA.fields_by_name['controlState'].enum_type = _PB_CONTROLSTATE
_PB_CONTROLDATA.fields_by_name['startTime'].message_type = _PB_TIME
_PB_CONTROLDATA.fields_by_name['elapsedTime'].message_type = _PB_TIME
_PB_CONTROLDATA.fields_by_name['duration'].message_type = _PB_TIME
_PB_FULLCONTROLDATA.fields_by_name['leadControlMode'].enum_type = _PB_CONTROLMODE
_PB_FULLCONTROLDATA.fields_by_name['ovenState'].enum_type = _PB_OVENSTATE
_PB_FULLCONTROLDATA.fields_by_name['data'].message_type = _PB_CONTROLDATA
DESCRIPTOR.message_types_by_name['PB_Command'] = _PB_COMMAND
DESCRIPTOR.message_types_by_name['PB_Time'] = _PB_TIME
DESCRIPTOR.message_types_by_name['PB_TempMeasure'] = _PB_TEMPMEASURE
DESCRIPTOR.message_types_by_name['PB_TempProfile'] = _PB_TEMPPROFILE
DESCRIPTOR.message_types_by_name['PB_ResponseGetTempProfile'] = _PB_RESPONSEGETTEMPPROFILE
DESCRIPTOR.message_types_by_name['PB_Response'] = _PB_RESPONSE
DESCRIPTOR.message_types_by_name['PB_SwitchOvenState'] = _PB_SWITCHOVENSTATE
DESCRIPTOR.message_types_by_name['PB_ControlData'] = _PB_CONTROLDATA
DESCRIPTOR.message_types_by_name['PB_FullControlData'] = _PB_FULLCONTROLDATA
DESCRIPTOR.enum_types_by_name['PB_MsgType'] = _PB_MSGTYPE
DESCRIPTOR.enum_types_by_name['PB_CmdType'] = _PB_CMDTYPE
DESCRIPTOR.enum_types_by_name['PB_OvenState'] = _PB_OVENSTATE
DESCRIPTOR.enum_types_by_name['PB_ControlMode'] = _PB_CONTROLMODE
DESCRIPTOR.enum_types_by_name['PB_ControlState'] = _PB_CONTROLSTATE
DESCRIPTOR.enum_types_by_name['PB_ErrorType'] = _PB_ERRORTYPE
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

PB_Command = _reflection.GeneratedProtocolMessageType('PB_Command', (_message.Message,), dict(
  DESCRIPTOR = _PB_COMMAND,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_Command)
  ))
_sym_db.RegisterMessage(PB_Command)

PB_Time = _reflection.GeneratedProtocolMessageType('PB_Time', (_message.Message,), dict(
  DESCRIPTOR = _PB_TIME,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_Time)
  ))
_sym_db.RegisterMessage(PB_Time)

PB_TempMeasure = _reflection.GeneratedProtocolMessageType('PB_TempMeasure', (_message.Message,), dict(
  DESCRIPTOR = _PB_TEMPMEASURE,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_TempMeasure)
  ))
_sym_db.RegisterMessage(PB_TempMeasure)

PB_TempProfile = _reflection.GeneratedProtocolMessageType('PB_TempProfile', (_message.Message,), dict(
  DESCRIPTOR = _PB_TEMPPROFILE,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_TempProfile)
  ))
_sym_db.RegisterMessage(PB_TempProfile)

PB_ResponseGetTempProfile = _reflection.GeneratedProtocolMessageType('PB_ResponseGetTempProfile', (_message.Message,), dict(
  DESCRIPTOR = _PB_RESPONSEGETTEMPPROFILE,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_ResponseGetTempProfile)
  ))
_sym_db.RegisterMessage(PB_ResponseGetTempProfile)

PB_Response = _reflection.GeneratedProtocolMessageType('PB_Response', (_message.Message,), dict(
  DESCRIPTOR = _PB_RESPONSE,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_Response)
  ))
_sym_db.RegisterMessage(PB_Response)

PB_SwitchOvenState = _reflection.GeneratedProtocolMessageType('PB_SwitchOvenState', (_message.Message,), dict(
  DESCRIPTOR = _PB_SWITCHOVENSTATE,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_SwitchOvenState)
  ))
_sym_db.RegisterMessage(PB_SwitchOvenState)

PB_ControlData = _reflection.GeneratedProtocolMessageType('PB_ControlData', (_message.Message,), dict(
  DESCRIPTOR = _PB_CONTROLDATA,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_ControlData)
  ))
_sym_db.RegisterMessage(PB_ControlData)

PB_FullControlData = _reflection.GeneratedProtocolMessageType('PB_FullControlData', (_message.Message,), dict(
  DESCRIPTOR = _PB_FULLCONTROLDATA,
  __module__ = 'reflow_oven_pb2'
  # @@protoc_insertion_point(class_scope:PB_FullControlData)
  ))
_sym_db.RegisterMessage(PB_FullControlData)


_PB_COMMAND.fields_by_name['priority']._options = None
_PB_COMMAND.fields_by_name['ACM_idx']._options = None
_PB_TEMPPROFILE.fields_by_name['countPoints']._options = None
_PB_TEMPPROFILE.fields_by_name['data']._options = None
_PB_FULLCONTROLDATA.fields_by_name['data']._options = None
# @@protoc_insertion_point(module_scope)
