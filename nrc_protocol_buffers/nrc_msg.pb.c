/* Automatically generated nanopb constant definitions */
/* Generated by nanopb-0.3.9.3 at Sun Oct 06 15:01:24 2019. */

#include "nrc_msg.pb.h"

/* @@protoc_insertion_point(includes) */
#if PB_PROTO_HEADER_VERSION != 30
#error Regenerate this file with the current version of nanopb generator.
#endif



const pb_field_t OvenCommand_fields[4] = {
    PB_FIELD(  1, UENUM   , SINGULAR, STATIC  , FIRST, OvenCommand, type, type, 0),
    PB_FIELD(  2, UINT32  , SINGULAR, STATIC  , OTHER, OvenCommand, id, type, 0),
    PB_FIELD(  3, UINT32  , SINGULAR, STATIC  , OTHER, OvenCommand, priority, id, 0),
    PB_LAST_FIELD
};

const pb_field_t TempMeasure_fields[3] = {
    PB_FIELD(  1, UINT32  , SINGULAR, STATIC  , FIRST, TempMeasure, time, time, 0),
    PB_FIELD(  2, UINT32  , SINGULAR, STATIC  , OTHER, TempMeasure, temp, time, 0),
    PB_LAST_FIELD
};

const pb_field_t TempProfile_fields[3] = {
    PB_FIELD(  1, UINT32  , SINGULAR, STATIC  , FIRST, TempProfile, countPoints, countPoints, 0),
    PB_REPEATED_FIXED_COUNT(  2, MESSAGE , OTHER, TempProfile, data, countPoints, &TempMeasure_fields),
    PB_LAST_FIELD
};

const pb_field_t AnsCmdGetTempProfile_fields[3] = {
    PB_FIELD(  1, BOOL    , SINGULAR, STATIC  , FIRST, AnsCmdGetTempProfile, success, success, 0),
    PB_FIELD(  2, MESSAGE , SINGULAR, STATIC  , OTHER, AnsCmdGetTempProfile, profile, success, &TempProfile_fields),
    PB_LAST_FIELD
};

const pb_field_t AnsCmdGetState_fields[3] = {
    PB_FIELD(  1, UENUM   , SINGULAR, STATIC  , FIRST, AnsCmdGetState, state, state, 0),
    PB_FIELD(  2, UENUM   , SINGULAR, STATIC  , OTHER, AnsCmdGetState, error, state, 0),
    PB_LAST_FIELD
};

const pb_field_t AnsCmdStart_fields[3] = {
    PB_FIELD(  1, BOOL    , SINGULAR, STATIC  , FIRST, AnsCmdStart, success, success, 0),
    PB_FIELD(  2, UINT32  , SINGULAR, STATIC  , OTHER, AnsCmdStart, startTime, success, 0),
    PB_LAST_FIELD
};

const pb_field_t AnsCmdStop_fields[3] = {
    PB_FIELD(  1, BOOL    , SINGULAR, STATIC  , FIRST, AnsCmdStop, success, success, 0),
    PB_FIELD(  2, UINT32  , SINGULAR, STATIC  , OTHER, AnsCmdStop, stopTime, success, 0),
    PB_LAST_FIELD
};

const pb_field_t AnsTempMeasure_fields[2] = {
    PB_FIELD(  1, BOOL    , SINGULAR, STATIC  , FIRST, AnsTempMeasure, success, success, 0),
    PB_LAST_FIELD
};

const pb_field_t FinishProgram_fields[2] = {
    PB_FIELD(  1, BOOL    , SINGULAR, STATIC  , FIRST, FinishProgram, success, success, 0),
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
PB_STATIC_ASSERT((pb_membersize(TempProfile, data[0]) < 65536 && pb_membersize(AnsCmdGetTempProfile, profile) < 65536), YOU_MUST_DEFINE_PB_FIELD_32BIT_FOR_MESSAGES_OvenCommand_TempMeasure_TempProfile_AnsCmdGetTempProfile_AnsCmdGetState_AnsCmdStart_AnsCmdStop_AnsTempMeasure_FinishProgram)
#endif

#if !defined(PB_FIELD_16BIT) && !defined(PB_FIELD_32BIT)
/* If you get an error here, it means that you need to define PB_FIELD_16BIT
 * compile-time option. You can do that in pb.h or on compiler command line.
 * 
 * The reason you need to do this is that some of your messages contain tag
 * numbers or field sizes that are larger than what can fit in the default
 * 8 bit descriptors.
 */
PB_STATIC_ASSERT((pb_membersize(TempProfile, data[0]) < 256 && pb_membersize(AnsCmdGetTempProfile, profile) < 256), YOU_MUST_DEFINE_PB_FIELD_16BIT_FOR_MESSAGES_OvenCommand_TempMeasure_TempProfile_AnsCmdGetTempProfile_AnsCmdGetState_AnsCmdStart_AnsCmdStop_AnsTempMeasure_FinishProgram)
#endif


/* @@protoc_insertion_point(eof) */
