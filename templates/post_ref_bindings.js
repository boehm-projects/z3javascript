var ffi = require('@makeomatic/ffi-napi');
var Z3 = ffi.Library(libPath, GeneratedBindings);

/**
 * For some reason FFI doesn't work if a pointer passes to a renderer and then back to the master in Electron
 * To work around this we maintain an internal heap and rewrite all incoming pointers
 * TODO: Work out a way to clear free'd memory from the heap?
 */

var POINTERS = {};
var last_pointer_id = 0;

function wrapPtr(ptr) {
    if (ptr && typeof(ptr) == "object") {
        POINTERS[last_pointer_id] = ptr;
        return { id: last_pointer_id++, _ptr: true };
    } else {
        return ptr;
    }
}

function unwrap(ptr) {
    if (ptr && ptr._ptr) {
        return POINTERS[ptr.id];
    } else if (ptr instanceof Array) {
        for (var i = 0; i < ptr.length; i++) {
            ptr[i] = unwrap(ptr[i]);
        }
        return ptr;
    } else {
        return ptr;
    }
}

/**
 * END OF UGLY HEAP
 */

for (var modifiedBinding in GeneratedBindings) {
   const originFn = Z3[modifiedBinding];
   Z3[modifiedBinding] = function() {
       for (var i = 0; i < arguments.length; i++) {
           arguments[i] = unwrap(arguments[i]);
       }
       return wrapPtr(originFn.apply(this, arguments));
   };
}

Z3.bindings_model_eval = function(ctx, mdl, expr) {
	var pAST = ref.alloc(Z3.Ast, null);
    var result = Z3.Z3_model_eval(ctx, mdl, expr, true, pAST);
    return result != 0 ? pAST.deref() : null;
}

//////// End Z3 function definitions
// Constants - these are taken from z3onsts.py (and reformatted for export)
// enum Z3_lbool
Z3.TRUE = 1;
Z3.UNDEF = 0;
Z3.FALSE = -1;

// enum Z3_symbol_kind
Z3.INT_SYMBOL = 0;
Z3.STRING_SYMBOL = 1;

// enum Z3_parameter_kind
Z3.PARAMETER_FUNC_DECL = 6;
Z3.PARAMETER_DOUBLE = 1;
Z3.PARAMETER_SYMBOL = 3;
Z3.PARAMETER_INT = 0;
Z3.PARAMETER_AST = 5;
Z3.PARAMETER_SORT = 4;
Z3.PARAMETER_RATIONAL = 2;

// enum Z3_sort_kind
Z3.BV_SORT = 4;
Z3.FINITE_DOMAIN_SORT = 8;
Z3.ARRAY_SORT = 5;
Z3.UNKNOWN_SORT = 1000;
Z3.RELATION_SORT = 7;
Z3.REAL_SORT = 3;
Z3.INT_SORT = 2;
Z3.UNINTERPRETED_SORT = 0;
Z3.BOOL_SORT = 1;
Z3.DATATYPE_SORT = 6;
Z3.SEQ_SORT = 11;

// enum  Z3_ast_kind
Z3.CONST_STR = 0;
Z3.CONST_BOOL = 1;
Z3.FUNC = 2;
Z3.NUMERAL = 3;
Z3.VARIABLE = 4;
Z3.STR_VARIABLE = 5;
Z3.INT_VARIABLE = 6;
Z3.QUANTIFIER = 7;
Z3.UNKNOWN_TYPE = 8;
Z3.STAR_TYPE = 9;
Z3.CONCAT_TYPE = 10;
Z3.SEARCH_TYPE = 11;
Z3.REPLACE_ALL = 12;
Z3.SUBSTRING = 13;

// enum  Z3_ast_kind
Z3.VAR_AST = 2;
Z3.SORT_AST = 4;
Z3.QUANTIFIER_AST = 3;
Z3.UNKNOWN_AST = 1000;
Z3.FUNC_DECL_AST = 5;
Z3.NUMERAL_AST = 0;
Z3.APP_AST = 1;

// enum Z3_decl_kind
Z3.OP_LABEL = 1792;
Z3.OP_PR_REWRITE = 1294;
Z3.OP_UNINTERPRETED = 2051;
Z3.OP_SUB = 519;
Z3.OP_ZERO_EXT = 1058;
Z3.OP_ADD = 518;
Z3.OP_IS_INT = 528;
Z3.OP_BREDOR = 1061;
Z3.OP_BNOT = 1051;
Z3.OP_BNOR = 1054;
Z3.OP_PR_CNF_STAR = 1315;
Z3.OP_RA_JOIN = 1539;
Z3.OP_LE = 514;
Z3.OP_SET_UNION = 773;
Z3.OP_PR_UNDEF = 1280;
Z3.OP_BREDAND = 1062;
Z3.OP_LT = 516;
Z3.OP_RA_UNION = 1540;
Z3.OP_BADD = 1028;
Z3.OP_BUREM0 = 1039;
Z3.OP_OEQ = 267;
Z3.OP_PR_MODUS_PONENS = 1284;
Z3.OP_RA_CLONE = 1548;
Z3.OP_REPEAT = 1060;
Z3.OP_RA_NEGATION_FILTER = 1544;
Z3.OP_BSMOD0 = 1040;
Z3.OP_BLSHR = 1065;
Z3.OP_BASHR = 1066;
Z3.OP_PR_UNIT_RESOLUTION = 1304;
Z3.OP_ROTATE_RIGHT = 1068;
Z3.OP_ARRAY_DEFAULT = 772;
Z3.OP_PR_PULL_QUANT = 1296;
Z3.OP_PR_APPLY_DEF = 1310;
Z3.OP_PR_REWRITE_STAR = 1295;
Z3.OP_IDIV = 523;
Z3.OP_PR_GOAL = 1283;
Z3.OP_PR_IFF_TRUE = 1305;
Z3.OP_LABEL_LIT = 1793;
Z3.OP_BOR = 1050;
Z3.OP_PR_SYMMETRY = 1286;
Z3.OP_TRUE = 256;
Z3.OP_SET_COMPLEMENT = 776;
Z3.OP_CONCAT = 1056;
Z3.OP_PR_NOT_OR_ELIM = 1293;
Z3.OP_IFF = 263;
Z3.OP_BSHL = 1064;
Z3.OP_PR_TRANSITIVITY = 1287;
Z3.OP_SGT = 1048;
Z3.OP_RA_WIDEN = 1541;
Z3.OP_PR_DEF_INTRO = 1309;
Z3.OP_NOT = 265;
Z3.OP_PR_QUANT_INTRO = 1290;
Z3.OP_UGT = 1047;
Z3.OP_DT_RECOGNISER = 2049;
Z3.OP_SET_INTERSECT = 774;
Z3.OP_BSREM = 1033;
Z3.OP_RA_STORE = 1536;
Z3.OP_SLT = 1046;
Z3.OP_ROTATE_LEFT = 1067;
Z3.OP_PR_NNF_NEG = 1313;
Z3.OP_PR_REFLEXIVITY = 1285;
Z3.OP_ULEQ = 1041;
Z3.OP_BIT1 = 1025;
Z3.OP_BIT0 = 1026;
Z3.OP_EQ = 258;
Z3.OP_BMUL = 1030;
Z3.OP_ARRAY_MAP = 771;
Z3.OP_STORE = 768;
Z3.OP_PR_HYPOTHESIS = 1302;
Z3.OP_RA_RENAME = 1545;
Z3.OP_AND = 261;
Z3.OP_TO_REAL = 526;
Z3.OP_PR_NNF_POS = 1312;
Z3.OP_PR_AND_ELIM = 1292;
Z3.OP_MOD = 525;
Z3.OP_BUDIV0 = 1037;
Z3.OP_PR_TRUE = 1281;
Z3.OP_BNAND = 1053;
Z3.OP_PR_ELIM_UNUSED_VARS = 1299;
Z3.OP_RA_FILTER = 1543;
Z3.OP_FD_LT = 1549;
Z3.OP_RA_EMPTY = 1537;
Z3.OP_DIV = 522;
Z3.OP_ANUM = 512;
Z3.OP_MUL = 521;
Z3.OP_UGEQ = 1043;
Z3.OP_BSREM0 = 1038;
Z3.OP_PR_TH_LEMMA = 1318;
Z3.OP_BXOR = 1052;
Z3.OP_DISTINCT = 259;
Z3.OP_PR_IFF_FALSE = 1306;
Z3.OP_BV2INT = 1072;
Z3.OP_EXT_ROTATE_LEFT = 1069;
Z3.OP_PR_PULL_QUANT_STAR = 1297;
Z3.OP_BSUB = 1029;
Z3.OP_PR_ASSERTED = 1282;
Z3.OP_BXNOR = 1055;
Z3.OP_EXTRACT = 1059;
Z3.OP_PR_DER = 1300;
Z3.OP_DT_CONSTRUCTOR = 2048;
Z3.OP_GT = 517;
Z3.OP_BUREM = 1034;
Z3.OP_IMPLIES = 266;
Z3.OP_SLEQ = 1042;
Z3.OP_GE = 515;
Z3.OP_BAND = 1049;
Z3.OP_ITE = 260;
Z3.OP_AS_ARRAY = 778;
Z3.OP_RA_SELECT = 1547;
Z3.OP_CONST_ARRAY = 770;
Z3.OP_BSDIV = 1031;
Z3.OP_OR = 262;
Z3.OP_PR_HYPER_RESOLVE = 1319;
Z3.OP_AGNUM = 513;
Z3.OP_PR_PUSH_QUANT = 1298;
Z3.OP_BSMOD = 1035;
Z3.OP_PR_IFF_OEQ = 1311;
Z3.OP_INTERP = 268;
Z3.OP_PR_LEMMA = 1303;
Z3.OP_SET_SUBSET = 777;
Z3.OP_SELECT = 769;
Z3.OP_RA_PROJECT = 1542;
Z3.OP_BNEG = 1027;
Z3.OP_UMINUS = 520;
Z3.OP_REM = 524;
Z3.OP_TO_INT = 527;
Z3.OP_PR_QUANT_INST = 1301;
Z3.OP_SGEQ = 1044;
Z3.OP_POWER = 529;
Z3.OP_XOR3 = 1074;
Z3.OP_RA_IS_EMPTY = 1538;
Z3.OP_CARRY = 1073;
Z3.OP_DT_ACCESSOR = 2050;
Z3.OP_PR_TRANSITIVITY_STAR = 1288;
Z3.OP_PR_NNF_STAR = 1314;
Z3.OP_PR_COMMUTATIVITY = 1307;
Z3.OP_ULT = 1045;
Z3.OP_BSDIV0 = 1036;
Z3.OP_SET_DIFFERENCE = 775;
Z3.OP_INT2BV = 1071;
Z3.OP_XOR = 264;
Z3.OP_PR_MODUS_PONENS_OEQ = 1317;
Z3.OP_BNUM = 1024;
Z3.OP_BUDIV = 1032;
Z3.OP_PR_MONOTONICITY = 1289;
Z3.OP_PR_DEF_AXIOM = 1308;
Z3.OP_FALSE = 257;
Z3.OP_EXT_ROTATE_RIGHT = 1070;
Z3.OP_PR_DISTRIBUTIVITY = 1291;
Z3.OP_SIGN_EXT = 1057;
Z3.OP_PR_SKOLEMIZE = 1316;
Z3.OP_BCOMP = 1063;
Z3.OP_RA_COMPLEMENT = 1546;

// enum Z3_param_kind
Z3.PK_BOOL = 1;
Z3.PK_SYMBOL = 3;
Z3.PK_OTHER = 5;
Z3.PK_INVALID = 6;
Z3.PK_UINT = 0;
Z3.PK_STRING = 4;
Z3.PK_DOUBLE = 2;

// enum Z3_search_failure
Z3.QUANTIFIERS = 7;
Z3.UNKNOWN = 1;
Z3.CANCELED = 4;
Z3.MEMOUT_WATERMARK = 3;
Z3.THEORY = 6;
Z3.NO_FAILURE = 0;
Z3.TIMEOUT = 2;
Z3.NUM_CONFLICTS = 5;

// enum Z3_ast_print_mode
Z3.PRINT_SMTLIB2_COMPLIANT = 3;
Z3.PRINT_SMTLIB_COMPLIANT = 2;
Z3.PRINT_SMTLIB_FULL = 0;
Z3.PRINT_LOW_LEVEL = 1;

// enum Z3_error_code
Z3.INVALID_PATTERN = 6;
Z3.MEMOUT_FAIL = 7;
Z3.NO_PARSER = 5;
Z3.OK = 0;
Z3.INVALID_ARG = 3;
Z3.EXCEPTION = 12;
Z3.IOB = 2;
Z3.INTERNAL_FATAL = 9;
Z3.INVALID_USAGE = 10;
Z3.FILE_ACCESS_ERROR = 8;
Z3.SORT_ERROR = 1;
Z3.PARSER_ERROR = 4;
Z3.DEC_REF_ERROR = 11;

// enum Z3_goal_prec;
Z3.GOAL_UNDER = 1;
Z3.GOAL_PRECISE = 0;
Z3.GOAL_UNDER_OVER = 3;
Z3.GOAL_OVER = 2;

/////// end constants

//// Exported types
Z3.Ast = Ast;

Z3.AstArray = AstArray;
Z3.CUIntArray = CUIntArray;
Z3.SymbolArray = SymbolArray
Z3.SortArray = SortArray;
Z3.FuncDeclArray = FuncDeclArray;
Z3.ConstructorArray = ConstructorArray;
Z3.ConstructorListArray = ConstructorListArray;
Z3.PatternArray = PatternArray;
Z3.TacticObjArray = TacticObjArray;
Z3.RCFNumObjArray = RCFNumObjArray;

return Z3;
};

module.exports.default = module.exports;
