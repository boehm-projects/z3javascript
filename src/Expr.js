/**
 * Copyright Blake Loring <blake_l@parsed.uk> 2015
 */
"use strict";

import Z3 from './Z3Loader';
import Z3Utils from './Z3Utils';

class Expr {

    constructor(context, ast, checks) {
        this.ctx = context;
        this.ast = ast;
        Z3.Z3_inc_ref(this.ctx, this.ast);
        this.checks = checks || {
            trueCheck: [],
            falseCheck: []
        }
    }

    /**
     * Singleton simplify params, just allocate once per execution and
     * leave it rather than inc_ref and dec_refing each time
     */
    _simplifyParams() {
        if (!Expr._simpleParams) {
            let config = Z3.Z3_mk_params(this.ctx);
            Z3.Z3_params_inc_ref(this.ctx, config);
            Z3.Z3_params_set_bool(this.ctx, config, Z3.Z3_mk_string_symbol(this.ctx, "rewriter.elim_to_real"), true);
            Expr._simpleParams = config;
        }
        return Expr._simpleParams;
    }

    destroy() {
        Z3.Z3_dec_ref(this.ctx, this.ast);
        this.ast = null;
    }

    toString() {
        let inner = Z3.Z3_ast_to_string(this.ctx, this.ast);
        return "Expr {" + inner + "}";
    }

    isString() {
        return Z3.Z3_is_string(this.ctx, this.ast);
    }
    
    toPrettyString() {
        let output = Z3.Z3_ast_to_string(this.ctx, this.ast);
        output = output.replace(/\(not (\S)\)/g, "¬$1");
        output = output.replace("or", "∨");
        return output;
    }

    getBoolValue() {
        return Z3.Z3_get_bool_value(this.ctx, this.ast) == Z3.TRUE;
    }

    escapeString(str) {
            function replacer(match, p1) {
                var chars = str[p1 + 2] + str[p1 + 3];
                return String.fromCharCode(parseInt(chars, 16));
            }

            function unicodeReplacer(match, p1) {
                var chars = str[p1 + 2] + str[p1 + 3] + str[p1 + 4] + str[p1 + 5];
                return String.fromCharCode(parseInt(chars));
            }

            return str.replace(/\\x[0-9a-fA-F]{2}/g, replacer).replace(/\\u\d{4}/g, unicodeReplacer).replace(/\\a/g, '\a').replace(/\\b/g, '\b').replace(/\\r/g, '\r').replace(/\\v/g, '\v').replace(/\\f/g, '\f').replace(/\\n/g, '\n').replace(/\\t/g, '\t');  
    }

    asConstant() {
        let kind = Z3.Z3_get_ast_kind(this.ctx, this.ast);

        switch (kind) {

            case Z3.NUMERAL_AST: {
                let num_dec_string = Z3.Z3_get_numeral_decimal_string(this.ctx, this.ast, 30);
                return Number(num_dec_string);
            }

            case Z3.APP_AST: {
                if (this.isString()) {
                    return this.escapeString(Z3.Z3_get_string(this.ctx, this.ast));
                } else {
                    return this.getBoolValue();
                }
            }

            default: {
                throw `Can't get constant of unknown AST kind type: ${kind}`;
                return undefined;
            }
        }
    }

    simplify() {
        let newAst = Z3.Z3_simplify_ex(this.ctx, this.ast, this._simplifyParams());
        Z3.Z3_inc_ref(this.ctx, newAst);
        this.destroy();
        this.ast = newAst;
        return this;
    }
}

export default Expr;
