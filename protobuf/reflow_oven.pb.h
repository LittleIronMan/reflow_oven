/* Automatically generated nanopb header */
/* Generated by nanopb-0.3.9.3 at Sun Oct 13 18:54:43 2019. */

#ifndef PB_REFLOW_OVEN_PB_H_INCLUDED
#define PB_REFLOW_OVEN_PB_H_INCLUDED
#include <pb.h>

/* @@protoc_insertion_point(includes) */
#if PB_PROTO_HEADER_VERSION != 30
#error Regenerate this file with the current version of nanopb generator.
#endif

#ifdef __cplusplus
extern "C" {
#endif

/* Enum definitions */
typedef enum _PB_MsgType {
    PB_MsgType_UNDEFINED = 0,
    PB_MsgType_CMD = 1,
    PB_MsgType_RESPONSE = 2,
    PB_MsgType_RESPONSE_GET_TEMP_PROFILE = 3,
    PB_MsgType_TEMP_MEASURE = 4,
    PB_MsgType_RESPONSE_TEMP_MEASURE = 5,
    PB_MsgType_FINISH_PROGRAM = 6,
    PB_MsgType_PLAIN_TEXT = 7
} PB_MsgType;
#define _PB_MsgType_MIN PB_MsgType_UNDEFINED
#define _PB_MsgType_MAX PB_MsgType_PLAIN_TEXT
#define _PB_MsgType_ARRAYSIZE ((PB_MsgType)(PB_MsgType_PLAIN_TEXT+1))

typedef enum _PB_CmdType {
    PB_CmdType_GET_TEMP_PROFILE = 0,
    PB_CmdType_GET_STATE = 1,
    PB_CmdType_START = 2,
    PB_CmdType_STOP = 3
} PB_CmdType;
#define _PB_CmdType_MIN PB_CmdType_GET_TEMP_PROFILE
#define _PB_CmdType_MAX PB_CmdType_STOP
#define _PB_CmdType_ARRAYSIZE ((PB_CmdType)(PB_CmdType_STOP+1))

typedef enum _PB_State {
    PB_State_STOPPED = 0,
    PB_State_LAUNCHED = 1
} PB_State;
#define _PB_State_MIN PB_State_STOPPED
#define _PB_State_MAX PB_State_LAUNCHED
#define _PB_State_ARRAYSIZE ((PB_State)(PB_State_LAUNCHED+1))

typedef enum _PB_ErrorType {
    PB_ErrorType_NONE = 0,
    PB_ErrorType_FAULTY_TEMPERATURE_SENSOR = 1,
    PB_ErrorType_FAULTY_RELAY = 2,
    PB_ErrorType_UNKNOWN_ERROR = 3
} PB_ErrorType;
#define _PB_ErrorType_MIN PB_ErrorType_NONE
#define _PB_ErrorType_MAX PB_ErrorType_UNKNOWN_ERROR
#define _PB_ErrorType_ARRAYSIZE ((PB_ErrorType)(PB_ErrorType_UNKNOWN_ERROR+1))

/* Struct definitions */
typedef struct _PB_Command {
    PB_CmdType cmdType;
    uint32_t id;
    uint8_t priority;
/* @@protoc_insertion_point(struct:PB_Command) */
} PB_Command;

typedef struct _PB_Response {
    PB_CmdType cmdType;
    uint32_t cmdId;
    bool success;
    PB_State state;
    PB_ErrorType error;
    uint32_t time;
    float mills;
/* @@protoc_insertion_point(struct:PB_Response) */
} PB_Response;

typedef struct _PB_TempMeasure {
    uint32_t time;
    float mills;
    float temp;
/* @@protoc_insertion_point(struct:PB_TempMeasure) */
} PB_TempMeasure;

typedef struct _PB_TempProfile {
    uint8_t countPoints;
    PB_TempMeasure data[10];
/* @@protoc_insertion_point(struct:PB_TempProfile) */
} PB_TempProfile;

typedef struct _PB_ResponseGetTempProfile {
    bool success;
    PB_TempProfile profile;
/* @@protoc_insertion_point(struct:PB_ResponseGetTempProfile) */
} PB_ResponseGetTempProfile;

/* Default values for struct fields */

/* Initializer values for message structs */
#define PB_Command_init_default                  {_PB_CmdType_MIN, 0, 0}
#define PB_TempMeasure_init_default              {0, 0, 0}
#define PB_TempProfile_init_default              {0, {PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default, PB_TempMeasure_init_default}}
#define PB_ResponseGetTempProfile_init_default   {0, PB_TempProfile_init_default}
#define PB_Response_init_default                 {_PB_CmdType_MIN, 0, 0, _PB_State_MIN, _PB_ErrorType_MIN, 0, 0}
#define PB_Command_init_zero                     {_PB_CmdType_MIN, 0, 0}
#define PB_TempMeasure_init_zero                 {0, 0, 0}
#define PB_TempProfile_init_zero                 {0, {PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero, PB_TempMeasure_init_zero}}
#define PB_ResponseGetTempProfile_init_zero      {0, PB_TempProfile_init_zero}
#define PB_Response_init_zero                    {_PB_CmdType_MIN, 0, 0, _PB_State_MIN, _PB_ErrorType_MIN, 0, 0}

/* Field tags (for use in manual encoding/decoding) */
#define PB_Command_cmdType_tag                   1
#define PB_Command_id_tag                        2
#define PB_Command_priority_tag                  3
#define PB_Response_cmdType_tag                  1
#define PB_Response_cmdId_tag                    2
#define PB_Response_success_tag                  3
#define PB_Response_state_tag                    4
#define PB_Response_error_tag                    5
#define PB_Response_time_tag                     6
#define PB_Response_mills_tag                    7
#define PB_TempMeasure_time_tag                  1
#define PB_TempMeasure_mills_tag                 2
#define PB_TempMeasure_temp_tag                  3
#define PB_TempProfile_countPoints_tag           1
#define PB_TempProfile_data_tag                  2
#define PB_ResponseGetTempProfile_success_tag    1
#define PB_ResponseGetTempProfile_profile_tag    2

/* Struct field encoding specification for nanopb */
extern const pb_field_t PB_Command_fields[4];
extern const pb_field_t PB_TempMeasure_fields[4];
extern const pb_field_t PB_TempProfile_fields[3];
extern const pb_field_t PB_ResponseGetTempProfile_fields[3];
extern const pb_field_t PB_Response_fields[8];

/* Maximum encoded size of messages (where known) */
#define PB_Command_size                          14
#define PB_TempMeasure_size                      16
#define PB_TempProfile_size                      186
#define PB_ResponseGetTempProfile_size           191
#define PB_Response_size                         25

/* Message IDs (where set with "msgid" option) */
#ifdef PB_MSGID

#define REFLOW_OVEN_MESSAGES \


#endif

#ifdef __cplusplus
} /* extern "C" */
#endif
/* @@protoc_insertion_point(eof) */

#endif
