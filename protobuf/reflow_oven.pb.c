/* Automatically generated nanopb constant definitions */
/* Generated by nanopb-0.3.9.3 at Sun Oct 13 18:54:43 2019. */

#include "reflow_oven.pb.h"

/* @@protoc_insertion_point(includes) */
#if PB_PROTO_HEADER_VERSION != 30
#error Regenerate this file with the current version of nanopb generator.
#endif



const pb_field_t PB_Command_fields[6] = {
    PB_FIELD(  1, UENUM   , SINGULAR, STATIC  , FIRST, PB_Command, cmdType, cmdType, 0),
    PB_FIELD(  2, UINT32  , SINGULAR, STATIC  , OTHER, PB_Command, id, cmdType, 0),
    PB_FIELD(  3, UINT32  , SINGULAR, STATIC  , OTHER, PB_Command, priority, id, 0),
    PB_FIELD(  4, UINT32  , SINGULAR, STATIC  , OTHER, PB_Command, acmIdx, priority, 0),
    PB_FIELD(  5, UINT32  , SINGULAR, STATIC  , OTHER, PB_Command, value, acmIdx, 0),
    PB_LAST_FIELD
};

const pb_field_t PB_Time_fields[3] = {
    PB_FIELD(  1, UINT32  , SINGULAR, STATIC  , FIRST, PB_Time, unixSeconds, unixSeconds, 0),
    PB_FIELD(  2, FLOAT   , SINGULAR, STATIC  , OTHER, PB_Time, mills, unixSeconds, 0),
    PB_LAST_FIELD
};

const pb_field_t PB_TempMeasure_fields[3] = {
    PB_FIELD(  1, MESSAGE , SINGULAR, STATIC  , FIRST, PB_TempMeasure, time, time, &PB_Time_fields),
    PB_FIELD(  2, FLOAT   , SINGULAR, STATIC  , OTHER, PB_TempMeasure, temp, time, 0),
    PB_LAST_FIELD
};

const pb_field_t PB_TempProfile_fields[3] = {
    PB_FIELD(  1, UINT32  , SINGULAR, STATIC  , FIRST, PB_TempProfile, countPoints, countPoints, 0),
    PB_REPEATED_FIXED_COUNT(  2, MESSAGE , OTHER, PB_TempProfile, data, countPoints, &PB_TempMeasure_fields),
    PB_LAST_FIELD
};

const pb_field_t PB_ResponseGetTempProfile_fields[3] = {
    PB_FIELD(  1, BOOL    , SINGULAR, STATIC  , FIRST, PB_ResponseGetTempProfile, success, success, 0),
    PB_FIELD(  2, MESSAGE , SINGULAR, STATIC  , OTHER, PB_ResponseGetTempProfile, profile, success, &PB_TempProfile_fields),
    PB_LAST_FIELD
};

const pb_field_t PB_Response_fields[7] = {
    PB_FIELD(  1, UENUM   , SINGULAR, STATIC  , FIRST, PB_Response, cmdType, cmdType, 0),
    PB_FIELD(  2, UINT32  , SINGULAR, STATIC  , OTHER, PB_Response, cmdId, cmdType, 0),
    PB_FIELD(  3, BOOL    , SINGULAR, STATIC  , OTHER, PB_Response, success, cmdId, 0),
    PB_FIELD(  4, UENUM   , SINGULAR, STATIC  , OTHER, PB_Response, ovenState, success, 0),
    PB_FIELD(  5, UENUM   , SINGULAR, STATIC  , OTHER, PB_Response, error, ovenState, 0),
    PB_FIELD(  6, MESSAGE , SINGULAR, STATIC  , OTHER, PB_Response, time, error, &PB_Time_fields),
    PB_LAST_FIELD
};

const pb_field_t PB_SwitchOvenState_fields[3] = {
    PB_FIELD(  1, MESSAGE , SINGULAR, STATIC  , FIRST, PB_SwitchOvenState, time, time, &PB_Time_fields),
    PB_FIELD(  2, UENUM   , SINGULAR, STATIC  , OTHER, PB_SwitchOvenState, ovenState, time, 0),
    PB_LAST_FIELD
};

const pb_field_t PB_ControlData_fields[7] = {
    PB_FIELD(  1, UENUM   , SINGULAR, STATIC  , FIRST, PB_ControlData, controlMode, controlMode, 0),
    PB_FIELD(  2, UENUM   , SINGULAR, STATIC  , OTHER, PB_ControlData, controlState, controlMode, 0),
    PB_FIELD(  3, BOOL    , SINGULAR, STATIC  , OTHER, PB_ControlData, isPaused, controlState, 0),
    PB_FIELD(  4, MESSAGE , SINGULAR, STATIC  , OTHER, PB_ControlData, startTime, isPaused, &PB_Time_fields),
    PB_FIELD(  5, MESSAGE , SINGULAR, STATIC  , OTHER, PB_ControlData, elapsedTime, startTime, &PB_Time_fields),
    PB_FIELD(  6, MESSAGE , SINGULAR, STATIC  , OTHER, PB_ControlData, duration, elapsedTime, &PB_Time_fields),
    PB_LAST_FIELD
};

const pb_field_t PB_FullControlData_fields[5] = {
    PB_FIELD(  1, UENUM   , SINGULAR, STATIC  , FIRST, PB_FullControlData, leadControlMode, leadControlMode, 0),
    PB_FIELD(  2, UENUM   , SINGULAR, STATIC  , OTHER, PB_FullControlData, ovenState, leadControlMode, 0),
    PB_FIELD(  3, FLOAT   , SINGULAR, STATIC  , OTHER, PB_FullControlData, constTempValue, ovenState, 0),
    PB_REPEATED_FIXED_COUNT(  4, MESSAGE , OTHER, PB_FullControlData, data, constTempValue, &PB_ControlData_fields),
    PB_LAST_FIELD
};








/* Check that field information fits in pb_field_t */
#if !defined(PB_FIELD_32BIT)
/* If you get an error here, it means that you need to define PB_FIELD_32BIT
 * compile-time option. You can do that in pb.h or on compiler command line.
 * 
 * The reason you need to do this is that some of your messages contain tag
 * numbers or field sizes that are larger than what can fit in 8 or 16 bit
 * field descriptors.
 */
PB_STATIC_ASSERT((pb_membersize(PB_TempMeasure, time) < 65536 && pb_membersize(PB_TempProfile, data[0]) < 65536 && pb_membersize(PB_ResponseGetTempProfile, profile) < 65536 && pb_membersize(PB_Response, time) < 65536 && pb_membersize(PB_SwitchOvenState, time) < 65536 && pb_membersize(PB_ControlData, startTime) < 65536 && pb_membersize(PB_ControlData, elapsedTime) < 65536 && pb_membersize(PB_ControlData, duration) < 65536 && pb_membersize(PB_FullControlData, data[0]) < 65536), YOU_MUST_DEFINE_PB_FIELD_32BIT_FOR_MESSAGES_PB_Command_PB_Time_PB_TempMeasure_PB_TempProfile_PB_ResponseGetTempProfile_PB_Response_PB_SwitchOvenState_PB_ControlData_PB_FullControlData)
#endif

#if !defined(PB_FIELD_16BIT) && !defined(PB_FIELD_32BIT)
/* If you get an error here, it means that you need to define PB_FIELD_16BIT
 * compile-time option. You can do that in pb.h or on compiler command line.
 * 
 * The reason you need to do this is that some of your messages contain tag
 * numbers or field sizes that are larger than what can fit in the default
 * 8 bit descriptors.
 */
PB_STATIC_ASSERT((pb_membersize(PB_TempMeasure, time) < 256 && pb_membersize(PB_TempProfile, data[0]) < 256 && pb_membersize(PB_ResponseGetTempProfile, profile) < 256 && pb_membersize(PB_Response, time) < 256 && pb_membersize(PB_SwitchOvenState, time) < 256 && pb_membersize(PB_ControlData, startTime) < 256 && pb_membersize(PB_ControlData, elapsedTime) < 256 && pb_membersize(PB_ControlData, duration) < 256 && pb_membersize(PB_FullControlData, data[0]) < 256), YOU_MUST_DEFINE_PB_FIELD_16BIT_FOR_MESSAGES_PB_Command_PB_Time_PB_TempMeasure_PB_TempProfile_PB_ResponseGetTempProfile_PB_Response_PB_SwitchOvenState_PB_ControlData_PB_FullControlData)
#endif


/* @@protoc_insertion_point(eof) */
