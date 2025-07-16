let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_export_2(addHeapObject(e));
    }
}

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_4.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_4.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}
/**
 * Validate an asset lock proof
 * @param {AssetLockProof} proof
 * @param {string | null} [identity_id]
 * @returns {boolean}
 */
export function validateAssetLockProof(proof, identity_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(proof, AssetLockProof);
        var ptr0 = isLikeNone(identity_id) ? 0 : passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        wasm.validateAssetLockProof(retptr, proof.__wbg_ptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Calculate the credits from an asset lock proof
 * @param {AssetLockProof} proof
 * @param {bigint | null} [duffs_per_credit]
 * @returns {bigint}
 */
export function calculateCreditsFromProof(proof, duffs_per_credit) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(proof, AssetLockProof);
        wasm.calculateCreditsFromProof(retptr, proof.__wbg_ptr, !isLikeNone(duffs_per_credit), isLikeNone(duffs_per_credit) ? BigInt(0) : duffs_per_credit);
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create an OutPoint from transaction ID and output index
 * @param {string} tx_id
 * @param {number} output_index
 * @returns {Uint8Array}
 */
export function createOutPoint(tx_id, output_index) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(tx_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.createOutPoint(retptr, ptr0, len0, output_index);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Helper to create an instant asset lock proof from component parts
 * @param {any} transaction
 * @param {number} output_index
 * @param {any} instant_lock
 * @returns {AssetLockProof}
 */
export function createInstantProofFromParts(transaction, output_index, instant_lock) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.createInstantProofFromParts(retptr, addHeapObject(transaction), output_index, addHeapObject(instant_lock));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return AssetLockProof.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Helper to create a chain asset lock proof from component parts
 * @param {number} core_chain_locked_height
 * @param {string} tx_id
 * @param {number} output_index
 * @returns {AssetLockProof}
 */
export function createChainProofFromParts(core_chain_locked_height, tx_id, output_index) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(tx_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.createChainProofFromParts(retptr, core_chain_locked_height, ptr0, len0, output_index);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return AssetLockProof.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Generate a new mnemonic phrase
 * @param {MnemonicStrength | null} [strength]
 * @param {WordListLanguage | null} [language]
 * @returns {string}
 */
export function generateMnemonic(strength, language) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateMnemonic(retptr, isLikeNone(strength) ? 0 : strength, isLikeNone(language) ? 10 : language);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Validate a mnemonic phrase
 * @param {string} phrase
 * @param {WordListLanguage | null} [language]
 * @returns {boolean}
 */
export function validateMnemonic(phrase, language) {
    const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.validateMnemonic(ptr0, len0, isLikeNone(language) ? 10 : language);
    return ret !== 0;
}

/**
 * Convert mnemonic to seed
 * @param {string} phrase
 * @param {string | null} [passphrase]
 * @param {WordListLanguage | null} [language]
 * @returns {Uint8Array}
 */
export function mnemonicToSeed(phrase, passphrase, language) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(passphrase) ? 0 : passStringToWasm0(passphrase, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.mnemonicToSeed(retptr, ptr0, len0, ptr1, len1, isLikeNone(language) ? 10 : language);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get word list for a language
 * @param {WordListLanguage | null} [language]
 * @returns {Array<any>}
 */
export function getWordList(language) {
    const ret = wasm.getWordList(isLikeNone(language) ? 10 : language);
    return takeObject(ret);
}

/**
 * Generate entropy for mnemonic
 * @param {MnemonicStrength | null} [strength]
 * @returns {Uint8Array}
 */
export function generateEntropy(strength) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateEntropy(retptr, isLikeNone(strength) ? 0 : strength);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Generate a BLS private key
 * @returns {Uint8Array}
 */
export function generateBlsPrivateKey() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.generateBlsPrivateKey(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Derive a BLS public key from a private key
 * @param {Uint8Array} private_key
 * @returns {Uint8Array}
 */
export function blsPrivateKeyToPublicKey(private_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(private_key, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.blsPrivateKeyToPublicKey(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Sign data with a BLS private key
 * @param {Uint8Array} data
 * @param {Uint8Array} private_key
 * @returns {Uint8Array}
 */
export function blsSign(data, private_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(private_key, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.blsSign(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Verify a BLS signature
 * @param {Uint8Array} signature
 * @param {Uint8Array} data
 * @param {Uint8Array} public_key
 * @returns {boolean}
 */
export function blsVerify(signature, data, public_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(signature, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(public_key, wasm.__wbindgen_export_0);
        const len2 = WASM_VECTOR_LEN;
        wasm.blsVerify(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Validate a BLS public key
 * @param {Uint8Array} public_key
 * @returns {boolean}
 */
export function validateBlsPublicKey(public_key) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(public_key, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.validateBlsPublicKey(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Aggregate multiple BLS signatures
 * @param {any} signatures
 * @returns {Uint8Array}
 */
export function blsAggregateSignatures(signatures) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.blsAggregateSignatures(retptr, addHeapObject(signatures));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a BLS threshold signature share
 * @param {Uint8Array} data
 * @param {Uint8Array} private_key_share
 * @param {number} share_id
 * @returns {Uint8Array}
 */
export function blsCreateThresholdShare(data, private_key_share, share_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(private_key_share, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.blsCreateThresholdShare(retptr, ptr0, len0, ptr1, len1, share_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get the size of a BLS signature in bytes
 * @returns {number}
 */
export function getBlsSignatureSize() {
    const ret = wasm.getBlsSignatureSize();
    return ret >>> 0;
}

/**
 * Get the size of a BLS public key in bytes
 * @returns {number}
 */
export function getBlsPublicKeySize() {
    const ret = wasm.getBlsPublicKeySize();
    return ret >>> 0;
}

/**
 * Get the size of a BLS private key in bytes
 * @returns {number}
 */
export function getBlsPrivateKeySize() {
    const ret = wasm.getBlsPrivateKeySize();
    return ret >>> 0;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
 * Calculate the hash of a state transition
 * @param {Uint8Array} state_transition_bytes
 * @returns {string}
 */
export function calculateStateTransitionHash(state_transition_bytes) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateStateTransitionHash(retptr, addBorrowedObject(state_transition_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Validate a state transition before broadcasting
 * @param {Uint8Array} state_transition_bytes
 * @param {number} platform_version
 * @returns {any}
 */
export function validateStateTransition(state_transition_bytes, platform_version) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.validateStateTransition(retptr, addBorrowedObject(state_transition_bytes), platform_version);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Process broadcast response from the platform
 * @param {Uint8Array} response_bytes
 * @returns {BroadcastResponse}
 */
export function processBroadcastResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.processBroadcastResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return BroadcastResponse.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Process wait for state transition result response
 * @param {Uint8Array} response_bytes
 * @returns {any}
 */
export function processWaitForSTResultResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.processWaitForSTResultResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Create a global contract cache instance
 * @param {ContractCacheConfig | null} [config]
 * @returns {ContractCache}
 */
export function createContractCache(config) {
    let ptr0 = 0;
    if (!isLikeNone(config)) {
        _assertClass(config, ContractCacheConfig);
        ptr0 = config.__destroy_into_raw();
    }
    const ret = wasm.createContractCache(ptr0);
    return ContractCache.__wrap(ret);
}

/**
 * Integration with WasmCacheManager
 * @param {WasmCacheManager} _cache_manager
 * @param {ContractCache} _contract_cache
 */
export function integrateContractCache(_cache_manager, _contract_cache) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(_cache_manager, WasmCacheManager);
        _assertClass(_contract_cache, ContractCache);
        wasm.integrateContractCache(retptr, _cache_manager.__wbg_ptr, _contract_cache.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Fetch contract history
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number | null} [start_at_ms]
 * @param {number | null} [limit]
 * @param {number | null} [offset]
 * @returns {Promise<Array<any>>}
 */
export function fetchContractHistory(sdk, contract_id, start_at_ms, limit, offset) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchContractHistory(sdk.__wbg_ptr, ptr0, len0, !isLikeNone(start_at_ms), isLikeNone(start_at_ms) ? 0 : start_at_ms, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, isLikeNone(offset) ? 0x100000001 : (offset) >>> 0);
    return takeObject(ret);
}

/**
 * Fetch all versions of a contract
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @returns {Promise<Array<any>>}
 */
export function fetchContractVersions(sdk, contract_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchContractVersions(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Get schema differences between versions
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number} from_version
 * @param {number} to_version
 * @returns {Promise<Array<any>>}
 */
export function getSchemaChanges(sdk, contract_id, from_version, to_version) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getSchemaChanges(sdk.__wbg_ptr, ptr0, len0, from_version, to_version);
    return takeObject(ret);
}

/**
 * Get contract at specific version
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number} version
 * @returns {Promise<any>}
 */
export function fetchContractAtVersion(sdk, contract_id, version) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchContractAtVersion(sdk.__wbg_ptr, ptr0, len0, version);
    return takeObject(ret);
}

/**
 * Check if contract has updates
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number} current_version
 * @returns {Promise<boolean>}
 */
export function checkContractUpdates(sdk, contract_id, current_version) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.checkContractUpdates(sdk.__wbg_ptr, ptr0, len0, current_version);
    return takeObject(ret);
}

/**
 * Get migration guide between versions
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number} from_version
 * @param {number} to_version
 * @returns {Promise<any>}
 */
export function getMigrationGuide(sdk, contract_id, from_version, to_version) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getMigrationGuide(sdk.__wbg_ptr, ptr0, len0, from_version, to_version);
    return takeObject(ret);
}

/**
 * Monitor contract for updates
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number} current_version
 * @param {Function} callback
 * @param {number | null} [poll_interval_ms]
 * @returns {Promise<any>}
 */
export function monitorContractUpdates(sdk, contract_id, current_version, callback, poll_interval_ms) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.monitorContractUpdates(sdk.__wbg_ptr, ptr0, len0, current_version, addHeapObject(callback), isLikeNone(poll_interval_ms) ? 0x100000001 : (poll_interval_ms) >>> 0);
    return takeObject(ret);
}

/**
 * Get the current epoch
 * @param {WasmSdk} sdk
 * @returns {Promise<Epoch>}
 */
export function getCurrentEpoch(sdk) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getCurrentEpoch(sdk.__wbg_ptr);
    return takeObject(ret);
}

/**
 * Get an epoch by index
 * @param {WasmSdk} sdk
 * @param {number} index
 * @returns {Promise<Epoch>}
 */
export function getEpochByIndex(sdk, index) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getEpochByIndex(sdk.__wbg_ptr, index);
    return takeObject(ret);
}

/**
 * Get evonodes for the current epoch
 * @param {WasmSdk} sdk
 * @returns {Promise<any>}
 */
export function getCurrentEvonodes(sdk) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getCurrentEvonodes(sdk.__wbg_ptr);
    return takeObject(ret);
}

/**
 * Get evonodes for a specific epoch
 * @param {WasmSdk} sdk
 * @param {number} epoch_index
 * @returns {Promise<any>}
 */
export function getEvonodesForEpoch(sdk, epoch_index) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getEvonodesForEpoch(sdk.__wbg_ptr, epoch_index);
    return takeObject(ret);
}

/**
 * Get a specific evonode by ProTxHash
 * @param {WasmSdk} sdk
 * @param {Uint8Array} pro_tx_hash
 * @returns {Promise<Evonode>}
 */
export function getEvonodeByProTxHash(sdk, pro_tx_hash) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passArray8ToWasm0(pro_tx_hash, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getEvonodeByProTxHash(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Get the quorum for the current epoch
 * @param {WasmSdk} sdk
 * @returns {Promise<any>}
 */
export function getCurrentQuorum(sdk) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getCurrentQuorum(sdk.__wbg_ptr);
    return takeObject(ret);
}

/**
 * Calculate the number of blocks in an epoch
 * @param {string} network
 * @returns {number}
 */
export function calculateEpochBlocks(network) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(network, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.calculateEpochBlocks(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 >>> 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Estimate when the next epoch will start
 * @param {WasmSdk} sdk
 * @param {bigint} current_block_height
 * @returns {Promise<any>}
 */
export function estimateNextEpochTime(sdk, current_block_height) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.estimateNextEpochTime(sdk.__wbg_ptr, current_block_height);
    return takeObject(ret);
}

/**
 * Get epoch info by block height
 * @param {WasmSdk} sdk
 * @param {bigint} block_height
 * @returns {Promise<Epoch>}
 */
export function getEpochForBlockHeight(sdk, block_height) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getEpochForBlockHeight(sdk.__wbg_ptr, block_height);
    return takeObject(ret);
}

/**
 * Get validator set changes between epochs
 * @param {WasmSdk} sdk
 * @param {number} from_epoch
 * @param {number} to_epoch
 * @returns {Promise<any>}
 */
export function getValidatorSetChanges(sdk, from_epoch, to_epoch) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getValidatorSetChanges(sdk.__wbg_ptr, from_epoch, to_epoch);
    return takeObject(ret);
}

/**
 * Get epoch statistics
 * @param {WasmSdk} sdk
 * @param {number} epoch_index
 * @returns {Promise<any>}
 */
export function getEpochStats(sdk, epoch_index) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.getEpochStats(sdk.__wbg_ptr, epoch_index);
    return takeObject(ret);
}

/**
 * Fetch an identity by ID
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {FetchOptions | null} [options]
 * @returns {Promise<IdentityWasm>}
 */
export function fetchIdentity(sdk, identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchIdentity(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch a data contract by ID
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {FetchOptions | null} [options]
 * @returns {Promise<DataContractWasm>}
 */
export function fetchDataContract(sdk, contract_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchDataContract(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch a document by ID
 * @param {WasmSdk} sdk
 * @param {string} document_id
 * @param {string} contract_id
 * @param {string} document_type
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchDocument(sdk, document_id, contract_id, document_type, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(document_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len2 = WASM_VECTOR_LEN;
    let ptr3 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr3 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchDocument(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3);
    return takeObject(ret);
}

/**
 * Fetch identity balance
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {FetchOptions | null} [options]
 * @returns {Promise<bigint>}
 */
export function fetchIdentityBalance(sdk, identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchIdentityBalance(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch identity nonce
 * @param {WasmSdk} sdk
 * @param {string} _identity_id
 * @param {string} _contract_id
 * @returns {Promise<bigint>}
 */
export function fetchIdentityNonce(sdk, _identity_id, _contract_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(_contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityNonce(sdk.__wbg_ptr, ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
 * Fetch multiple identities by their IDs
 *
 * This implementation fetches identities sequentially. For parallel fetching,
 * JavaScript callers can map over IDs and use Promise.all on individual fetch calls.
 * @param {WasmSdk} sdk
 * @param {string[]} identity_ids
 * @param {FetchManyOptions | null} [options]
 * @returns {Promise<FetchManyResponse>}
 */
export function fetch_identities(sdk, identity_ids, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passArrayJsValueToWasm0(identity_ids, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchManyOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetch_identities(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch multiple data contracts by their IDs
 * @param {WasmSdk} sdk
 * @param {string[]} contract_ids
 * @param {FetchManyOptions | null} [options]
 * @returns {Promise<FetchManyResponse>}
 */
export function fetch_data_contracts(sdk, contract_ids, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passArrayJsValueToWasm0(contract_ids, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchManyOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetch_data_contracts(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch multiple documents based on query criteria
 * @param {WasmSdk} _sdk
 * @param {DocumentQueryOptions} query_options
 * @param {FetchManyOptions | null} [options]
 * @returns {Promise<FetchManyResponse>}
 */
export function fetch_documents(_sdk, query_options, options) {
    _assertClass(_sdk, WasmSdk);
    _assertClass(query_options, DocumentQueryOptions);
    var ptr0 = query_options.__destroy_into_raw();
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchManyOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetch_documents(_sdk.__wbg_ptr, ptr0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch an identity without proof verification
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchIdentityUnproved(sdk, identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchIdentityUnproved(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch a data contract without proof verification
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchDataContractUnproved(sdk, contract_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchDataContractUnproved(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch documents without proof verification
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {string} document_type
 * @param {any} where_clause
 * @param {any} order_by
 * @param {number | null} [limit]
 * @param {Uint8Array | null} [start_at]
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchDocumentsUnproved(sdk, contract_id, document_type, where_clause, order_by, limit, start_at, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    var ptr2 = isLikeNone(start_at) ? 0 : passArray8ToWasm0(start_at, wasm.__wbindgen_export_0);
    var len2 = WASM_VECTOR_LEN;
    let ptr3 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr3 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchDocumentsUnproved(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, addHeapObject(where_clause), addHeapObject(order_by), isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, ptr2, len2, ptr3);
    return takeObject(ret);
}

/**
 * Fetch identity by public key hash without proof
 * @param {WasmSdk} sdk
 * @param {Uint8Array} public_key_hash
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchIdentityByKeyUnproved(sdk, public_key_hash, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passArray8ToWasm0(public_key_hash, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchIdentityByKeyUnproved(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Fetch data contract history without proof
 * @param {WasmSdk} sdk
 * @param {string} contract_id
 * @param {number | null} [start_at_ms]
 * @param {number | null} [limit]
 * @param {number | null} [offset]
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchDataContractHistoryUnproved(sdk, contract_id, start_at_ms, limit, offset, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchDataContractHistoryUnproved(sdk.__wbg_ptr, ptr0, len0, !isLikeNone(start_at_ms), isLikeNone(start_at_ms) ? 0 : start_at_ms, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, isLikeNone(offset) ? 0x100000001 : (offset) >>> 0, ptr1);
    return takeObject(ret);
}

/**
 * Batch fetch multiple items without proof
 * @param {WasmSdk} sdk
 * @param {any} requests
 * @param {FetchOptions | null} [options]
 * @returns {Promise<any>}
 */
export function fetchBatchUnproved(sdk, requests, options) {
    _assertClass(sdk, WasmSdk);
    let ptr0 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, FetchOptions);
        ptr0 = options.__destroy_into_raw();
    }
    const ret = wasm.fetchBatchUnproved(sdk.__wbg_ptr, addHeapObject(requests), ptr0);
    return takeObject(ret);
}

/**
 * Create a new group
 * @param {string} creator_id
 * @param {string} name
 * @param {string} description
 * @param {string} group_type
 * @param {number} threshold
 * @param {Array<any>} initial_members
 * @param {bigint} _identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createGroup(creator_id, name, description, group_type, threshold, initial_members, _identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(creator_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(description, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(group_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len3 = WASM_VECTOR_LEN;
        wasm.createGroup(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, threshold, addHeapObject(initial_members), _identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v5 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v5;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Add member to group
 * @param {string} group_id
 * @param {string} admin_id
 * @param {string} new_member_id
 * @param {string} role
 * @param {Array<any>} permissions
 * @param {bigint} _identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function addGroupMember(group_id, admin_id, new_member_id, role, permissions, _identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(admin_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(new_member_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(role, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len3 = WASM_VECTOR_LEN;
        wasm.addGroupMember(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, addHeapObject(permissions), _identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v5 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v5;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Remove member from group
 * @param {string} group_id
 * @param {string} admin_id
 * @param {string} member_id
 * @param {bigint} _identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function removeGroupMember(group_id, admin_id, member_id, _identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(admin_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(member_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        wasm.removeGroupMember(retptr, ptr0, len0, ptr1, len1, ptr2, len2, _identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a group proposal
 * @param {string} group_id
 * @param {string} proposer_id
 * @param {string} title
 * @param {string} description
 * @param {string} action_type
 * @param {Uint8Array} action_data
 * @param {number} duration_hours
 * @param {bigint} _identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createGroupProposal(group_id, proposer_id, title, description, action_type, action_data, duration_hours, _identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(proposer_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(title, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passStringToWasm0(description, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passStringToWasm0(action_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArray8ToWasm0(action_data, wasm.__wbindgen_export_0);
        const len5 = WASM_VECTOR_LEN;
        wasm.createGroupProposal(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, duration_hours, _identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v7 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v7;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Vote on group proposal
 * @param {string} proposal_id
 * @param {string} voter_id
 * @param {boolean} approve
 * @param {string | null | undefined} comment
 * @param {bigint} _identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function voteOnProposal(proposal_id, voter_id, approve, comment, _identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(proposal_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(voter_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(comment) ? 0 : passStringToWasm0(comment, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len2 = WASM_VECTOR_LEN;
        wasm.voteOnProposal(retptr, ptr0, len0, ptr1, len1, approve, ptr2, len2, _identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Execute approved proposal
 * @param {string} proposal_id
 * @param {string} executor_id
 * @param {bigint} _identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function executeProposal(proposal_id, executor_id, _identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(proposal_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(executor_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.executeProposal(retptr, ptr0, len0, ptr1, len1, _identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Fetch group information
 * @param {WasmSdk} sdk
 * @param {string} group_id
 * @returns {Promise<Group>}
 */
export function fetchGroup(sdk, group_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchGroup(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch group members
 * @param {WasmSdk} sdk
 * @param {string} group_id
 * @returns {Promise<Array<any>>}
 */
export function fetchGroupMembers(sdk, group_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchGroupMembers(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch active proposals for a group
 * @param {WasmSdk} sdk
 * @param {string} group_id
 * @param {boolean} active_only
 * @returns {Promise<Array<any>>}
 */
export function fetchGroupProposals(sdk, group_id, active_only) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchGroupProposals(sdk.__wbg_ptr, ptr0, len0, active_only);
    return takeObject(ret);
}

/**
 * Fetch user's groups
 * @param {WasmSdk} sdk
 * @param {string} user_id
 * @returns {Promise<Array<any>>}
 */
export function fetchUserGroups(sdk, user_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(user_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchUserGroups(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Check if user can perform action in group
 * @param {WasmSdk} sdk
 * @param {string} group_id
 * @param {string} user_id
 * @param {string} permission
 * @returns {Promise<boolean>}
 */
export function checkGroupPermission(sdk, group_id, user_id, permission) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(group_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(user_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(permission, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.checkGroupPermission(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
    return takeObject(ret);
}

/**
 * Fetch identity balance details
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @returns {Promise<IdentityBalance>}
 */
export function fetchIdentityBalanceDetails(sdk, identity_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityBalanceDetails(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch identity revision
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @returns {Promise<IdentityRevision>}
 */
export function fetchIdentityRevision(sdk, identity_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityRevision(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch complete identity info (balance + revision)
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @returns {Promise<IdentityInfo>}
 */
export function fetchIdentityInfo(sdk, identity_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityInfo(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch balance history for an identity
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {number | null} [from_timestamp]
 * @param {number | null} [to_timestamp]
 * @param {number | null} [limit]
 * @returns {Promise<any>}
 */
export function fetchIdentityBalanceHistory(sdk, identity_id, from_timestamp, to_timestamp, limit) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityBalanceHistory(sdk.__wbg_ptr, ptr0, len0, !isLikeNone(from_timestamp), isLikeNone(from_timestamp) ? 0 : from_timestamp, !isLikeNone(to_timestamp), isLikeNone(to_timestamp) ? 0 : to_timestamp, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0);
    return takeObject(ret);
}

/**
 * Check if identity has sufficient balance
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {bigint} required_amount
 * @param {boolean} use_unconfirmed
 * @returns {Promise<boolean>}
 */
export function checkIdentityBalance(sdk, identity_id, required_amount, use_unconfirmed) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.checkIdentityBalance(sdk.__wbg_ptr, ptr0, len0, required_amount, use_unconfirmed);
    return takeObject(ret);
}

/**
 * Estimate credits needed for an operation
 * @param {string} operation_type
 * @param {number | null} [data_size_bytes]
 * @returns {bigint}
 */
export function estimateCreditsNeeded(operation_type, data_size_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(operation_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.estimateCreditsNeeded(retptr, ptr0, len0, isLikeNone(data_size_bytes) ? 0x100000001 : (data_size_bytes) >>> 0);
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Monitor identity balance changes
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {Function} callback
 * @param {number | null} [poll_interval_ms]
 * @returns {Promise<any>}
 */
export function monitorIdentityBalance(sdk, identity_id, callback, poll_interval_ms) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.monitorIdentityBalance(sdk.__wbg_ptr, ptr0, len0, addHeapObject(callback), isLikeNone(poll_interval_ms) ? 0x100000001 : (poll_interval_ms) >>> 0);
    return takeObject(ret);
}

/**
 * Fetch identity public keys information
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @returns {Promise<any>}
 */
export function fetchIdentityKeys(sdk, identity_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityKeys(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch identity credit balance in Dash
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @returns {Promise<number>}
 */
export function fetchIdentityCreditsInDash(sdk, identity_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchIdentityCreditsInDash(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Batch fetch identity info for multiple identities
 * @param {WasmSdk} sdk
 * @param {string[]} identity_ids
 * @returns {Promise<any>}
 */
export function batchFetchIdentityInfo(sdk, identity_ids) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passArrayJsValueToWasm0(identity_ids, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.batchFetchIdentityInfo(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Get identity credit transfer fee estimate
 * @param {bigint} amount
 * @param {string | null} [priority]
 * @returns {bigint}
 */
export function estimateCreditTransferFee(amount, priority) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(priority) ? 0 : passStringToWasm0(priority, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        wasm.estimateCreditTransferFee(retptr, amount, ptr0, len0);
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Verify metadata against current state
 * @param {Metadata} metadata
 * @param {bigint} current_height
 * @param {number | null | undefined} current_time_ms
 * @param {MetadataVerificationConfig} config
 * @returns {MetadataVerificationResult}
 */
export function verifyMetadata(metadata, current_height, current_time_ms, config) {
    _assertClass(metadata, Metadata);
    _assertClass(config, MetadataVerificationConfig);
    const ret = wasm.verifyMetadata(metadata.__wbg_ptr, current_height, !isLikeNone(current_time_ms), isLikeNone(current_time_ms) ? 0 : current_time_ms, config.__wbg_ptr);
    return MetadataVerificationResult.__wrap(ret);
}

/**
 * Compare two metadata objects and determine which is more recent
 * @param {Metadata} metadata1
 * @param {Metadata} metadata2
 * @returns {number}
 */
export function compareMetadata(metadata1, metadata2) {
    _assertClass(metadata1, Metadata);
    _assertClass(metadata2, Metadata);
    const ret = wasm.compareMetadata(metadata1.__wbg_ptr, metadata2.__wbg_ptr);
    return ret;
}

/**
 * Get the most recent metadata from a list
 * @param {any[]} metadata_list
 * @returns {Metadata}
 */
export function getMostRecentMetadata(metadata_list) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArrayJsValueToWasm0(metadata_list, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.getMostRecentMetadata(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return Metadata.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Check if metadata is within acceptable staleness bounds
 * @param {Metadata} metadata
 * @param {bigint} max_age_ms
 * @param {bigint} max_height_behind
 * @param {bigint | null} [current_height]
 * @returns {boolean}
 */
export function isMetadataStale(metadata, max_age_ms, max_height_behind, current_height) {
    _assertClass(metadata, Metadata);
    const ret = wasm.isMetadataStale(metadata.__wbg_ptr, max_age_ms, max_height_behind, !isLikeNone(current_height), isLikeNone(current_height) ? BigInt(0) : current_height);
    return ret !== 0;
}

/**
 * Initialize global monitoring
 * @param {boolean} enabled
 * @param {number | null} [max_metrics]
 */
export function initializeMonitoring(enabled, max_metrics) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.initializeMonitoring(retptr, enabled, isLikeNone(max_metrics) ? 0x100000001 : (max_metrics) >>> 0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Check if global monitor is enabled
 * @returns {boolean}
 */
export function isGlobalMonitorEnabled() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isGlobalMonitorEnabled(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Track an async operation
 * @param {string} operation_name
 * @param {Function} operation_fn
 * @returns {Promise<any>}
 */
export function trackOperation(operation_name, operation_fn) {
    const ptr0 = passStringToWasm0(operation_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.trackOperation(ptr0, len0, addHeapObject(operation_fn));
    return takeObject(ret);
}

/**
 * Perform health check
 * @param {WasmSdk} sdk
 * @returns {Promise<HealthCheckResult>}
 */
export function performHealthCheck(sdk) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.performHealthCheck(sdk.__wbg_ptr);
    return takeObject(ret);
}

/**
 * Resource usage information
 * @returns {any}
 */
export function getResourceUsage() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getResourceUsage(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Check if identity nonce is cached and fresh
 * @param {string} identity_id
 * @returns {bigint | undefined}
 */
export function checkIdentityNonceCache(identity_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-32);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.checkIdentityNonceCache(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
        var r4 = getDataViewMemory0().getInt32(retptr + 4 * 4, true);
        var r5 = getDataViewMemory0().getInt32(retptr + 4 * 5, true);
        if (r5) {
            throw takeObject(r4);
        }
        return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(32);
    }
}

/**
 * Update identity nonce cache
 * @param {string} identity_id
 * @param {bigint} nonce
 */
export function updateIdentityNonceCache(identity_id, nonce) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.updateIdentityNonceCache(retptr, ptr0, len0, nonce);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Check if identity contract nonce is cached and fresh
 * @param {string} identity_id
 * @param {string} contract_id
 * @returns {bigint | undefined}
 */
export function checkIdentityContractNonceCache(identity_id, contract_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-32);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.checkIdentityContractNonceCache(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
        var r4 = getDataViewMemory0().getInt32(retptr + 4 * 4, true);
        var r5 = getDataViewMemory0().getInt32(retptr + 4 * 5, true);
        if (r5) {
            throw takeObject(r4);
        }
        return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(32);
    }
}

/**
 * Update identity contract nonce cache
 * @param {string} identity_id
 * @param {string} contract_id
 * @param {bigint} nonce
 */
export function updateIdentityContractNonceCache(identity_id, contract_id, nonce) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.updateIdentityContractNonceCache(retptr, ptr0, len0, ptr1, len1, nonce);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Increment identity nonce in cache
 * @param {string} identity_id
 * @param {number | null} [increment]
 * @returns {bigint}
 */
export function incrementIdentityNonceCache(identity_id, increment) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.incrementIdentityNonceCache(retptr, ptr0, len0, isLikeNone(increment) ? 0x100000001 : (increment) >>> 0);
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Increment identity contract nonce in cache
 * @param {string} identity_id
 * @param {string} contract_id
 * @param {number | null} [increment]
 * @returns {bigint}
 */
export function incrementIdentityContractNonceCache(identity_id, contract_id, increment) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.incrementIdentityContractNonceCache(retptr, ptr0, len0, ptr1, len1, isLikeNone(increment) ? 0x100000001 : (increment) >>> 0);
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Clear identity nonce cache
 */
export function clearIdentityNonceCache() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.clearIdentityNonceCache(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Clear identity contract nonce cache
 */
export function clearIdentityContractNonceCache() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.clearIdentityContractNonceCache(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        if (r1) {
            throw takeObject(r0);
        }
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Optimize Uint8Array conversions
 * @param {Uint8Array} data
 * @returns {Uint8Array}
 */
export function optimizeUint8Array(data) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.optimizeUint8Array(ptr0, len0);
    return takeObject(ret);
}

/**
 * Initialize string cache
 */
export function initStringCache() {
    wasm.initStringCache();
}

/**
 * Intern a string to reduce memory usage
 * @param {string} s
 * @returns {string}
 */
export function internString(s) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.internString(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        deferred2_0 = r0;
        deferred2_1 = r1;
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Clear string cache
 */
export function clearStringCache() {
    wasm.clearStringCache();
}

/**
 * Export optimization recommendations
 * @returns {Array<any>}
 */
export function getOptimizationRecommendations() {
    const ret = wasm.getOptimizationRecommendations();
    return takeObject(ret);
}

/**
 * Create prefunded balance allocation
 * @param {string} identity_id
 * @param {string} balance_type
 * @param {bigint} amount
 * @param {string} purpose
 * @param {number | null | undefined} lock_duration_ms
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createPrefundedBalance(identity_id, balance_type, amount, purpose, lock_duration_ms, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(purpose, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        wasm.createPrefundedBalance(retptr, ptr0, len0, ptr1, len1, amount, ptr2, len2, !isLikeNone(lock_duration_ms), isLikeNone(lock_duration_ms) ? 0 : lock_duration_ms, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Transfer prefunded balance
 * @param {string} from_identity_id
 * @param {string} to_identity_id
 * @param {string} balance_type
 * @param {bigint} amount
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function transferPrefundedBalance(from_identity_id, to_identity_id, balance_type, amount, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(from_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        wasm.transferPrefundedBalance(retptr, ptr0, len0, ptr1, len1, ptr2, len2, amount, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Use prefunded balance
 * @param {string} identity_id
 * @param {string} balance_type
 * @param {bigint} amount
 * @param {string} purpose
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function usePrefundedBalance(identity_id, balance_type, amount, purpose, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(purpose, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        wasm.usePrefundedBalance(retptr, ptr0, len0, ptr1, len1, amount, ptr2, len2, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Release locked balance
 * @param {string} identity_id
 * @param {string} balance_type
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function releasePrefundedBalance(identity_id, balance_type, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.releasePrefundedBalance(retptr, ptr0, len0, ptr1, len1, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Fetch prefunded balances for identity
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @returns {Promise<Array<any>>}
 */
export function fetchPrefundedBalances(sdk, identity_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchPrefundedBalances(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Get specific prefunded balance
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {string} balance_type
 * @returns {Promise<PrefundedBalance | undefined>}
 */
export function getPrefundedBalance(sdk, identity_id, balance_type) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.getPrefundedBalance(sdk.__wbg_ptr, ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

/**
 * Check if identity has sufficient prefunded balance
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {string} balance_type
 * @param {bigint} required_amount
 * @returns {Promise<boolean>}
 */
export function checkPrefundedBalance(sdk, identity_id, balance_type, required_amount) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.checkPrefundedBalance(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, required_amount);
    return takeObject(ret);
}

/**
 * Get balance allocation history
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {string | null | undefined} _balance_type
 * @param {boolean} active_only
 * @returns {Promise<Array<any>>}
 */
export function fetchBalanceAllocations(sdk, identity_id, _balance_type, active_only) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    var ptr1 = isLikeNone(_balance_type) ? 0 : passStringToWasm0(_balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    var len1 = WASM_VECTOR_LEN;
    const ret = wasm.fetchBalanceAllocations(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, active_only);
    return takeObject(ret);
}

/**
 * Monitor prefunded balance changes
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {string} balance_type
 * @param {Function} callback
 * @param {number | null} [poll_interval_ms]
 * @returns {Promise<any>}
 */
export function monitorPrefundedBalance(sdk, identity_id, balance_type, callback, poll_interval_ms) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(balance_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.monitorPrefundedBalance(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, addHeapObject(callback), isLikeNone(poll_interval_ms) ? 0x100000001 : (poll_interval_ms) >>> 0);
    return takeObject(ret);
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(takeObject(mem.getUint32(i, true)));
    }
    return result;
}
/**
 * Execute a request with retry logic
 * @param {Function} request_fn
 * @param {RequestSettings} settings
 * @returns {Promise<any>}
 */
export function executeWithRetry(request_fn, settings) {
    _assertClass(settings, RequestSettings);
    var ptr0 = settings.__destroy_into_raw();
    const ret = wasm.executeWithRetry(addHeapObject(request_fn), ptr0);
    return takeObject(ret);
}

/**
 * @param {WasmSdk} _sdk
 * @param {string} base58_id
 * @param {boolean} prove
 * @returns {Uint8Array}
 */
export function prepare_identity_fetch_request(_sdk, base58_id, prove) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(_sdk, WasmSdk);
        const ptr0 = passStringToWasm0(base58_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.prepare_identity_fetch_request(retptr, _sdk.__wbg_ptr, ptr0, len0, prove);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Serialize a GetIdentity request
 * @param {string} identity_id
 * @param {boolean} prove
 * @returns {Uint8Array}
 */
export function serializeGetIdentityRequest(identity_id, prove) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.serializeGetIdentityRequest(retptr, ptr0, len0, prove);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Deserialize a GetIdentity response
 * @param {Uint8Array} response_bytes
 * @returns {any}
 */
export function deserializeGetIdentityResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeGetIdentityResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Serialize a GetDataContract request
 * @param {string} contract_id
 * @param {boolean} prove
 * @returns {Uint8Array}
 */
export function serializeGetDataContractRequest(contract_id, prove) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.serializeGetDataContractRequest(retptr, ptr0, len0, prove);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Deserialize a GetDataContract response
 * @param {Uint8Array} response_bytes
 * @returns {any}
 */
export function deserializeGetDataContractResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeGetDataContractResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Serialize a BroadcastStateTransition request
 * @param {Uint8Array} state_transition_bytes
 * @returns {Uint8Array}
 */
export function serializeBroadcastRequest(state_transition_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.serializeBroadcastRequest(retptr, addBorrowedObject(state_transition_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Deserialize a BroadcastStateTransition response
 * @param {Uint8Array} response_bytes
 * @returns {any}
 */
export function deserializeBroadcastResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeBroadcastResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Serialize a GetIdentityNonce request
 * @param {string} identity_id
 * @param {boolean} prove
 * @returns {Uint8Array}
 */
export function serializeGetIdentityNonceRequest(identity_id, prove) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.serializeGetIdentityNonceRequest(retptr, ptr0, len0, prove);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Deserialize a GetIdentityNonce response
 * @param {Uint8Array} response_bytes
 * @returns {bigint}
 */
export function deserializeGetIdentityNonceResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeGetIdentityNonceResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getBigInt64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return BigInt.asUintN(64, r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Serialize a WaitForStateTransitionResult request
 * @param {string} state_transition_hash
 * @param {boolean} prove
 * @returns {Uint8Array}
 */
export function serializeWaitForStateTransitionRequest(state_transition_hash, prove) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(state_transition_hash, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.serializeWaitForStateTransitionRequest(retptr, ptr0, len0, prove);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Deserialize a WaitForStateTransitionResult response
 * @param {Uint8Array} response_bytes
 * @returns {any}
 */
export function deserializeWaitForStateTransitionResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeWaitForStateTransitionResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Serialize document query parameters
 * @param {string} contract_id
 * @param {string} document_type
 * @param {any} where_clause
 * @param {any} order_by
 * @param {number | null | undefined} limit
 * @param {string | null | undefined} start_after
 * @param {boolean} prove
 * @returns {Uint8Array}
 */
export function serializeDocumentQuery(contract_id, document_type, where_clause, order_by, limit, start_after, prove) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(start_after) ? 0 : passStringToWasm0(start_after, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len2 = WASM_VECTOR_LEN;
        wasm.serializeDocumentQuery(retptr, ptr0, len0, ptr1, len1, addBorrowedObject(where_clause), addBorrowedObject(order_by), isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, ptr2, len2, prove);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Deserialize document query response
 * @param {Uint8Array} response_bytes
 * @returns {any}
 */
export function deserializeDocumentQueryResponse(response_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeDocumentQueryResponse(retptr, addBorrowedObject(response_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Prepare a state transition for broadcast
 * @param {Uint8Array} state_transition_bytes
 * @returns {any}
 */
export function prepareStateTransitionForBroadcast(state_transition_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.prepareStateTransitionForBroadcast(retptr, addBorrowedObject(state_transition_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Get required signatures for a state transition
 * @param {Uint8Array} state_transition_bytes
 * @returns {any}
 */
export function getRequiredSignaturesForStateTransition(state_transition_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getRequiredSignaturesForStateTransition(retptr, addBorrowedObject(state_transition_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
 * Create a new data contract
 * @param {string} owner_id
 * @param {any} contract_definition
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function create_data_contract(owner_id, contract_definition, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(owner_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.create_data_contract(retptr, ptr0, len0, addHeapObject(contract_definition), identity_nonce, addHeapObject(signature_public_key_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Update an existing data contract
 * @param {string} contract_id
 * @param {string} owner_id
 * @param {any} contract_definition
 * @param {bigint} identity_contract_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function update_data_contract(contract_id, owner_id, contract_definition, identity_contract_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(owner_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.update_data_contract(retptr, ptr0, len0, ptr1, len1, addHeapObject(contract_definition), identity_contract_nonce, addHeapObject(signature_public_key_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a simple document batch transition
 *
 * Note: This is a simplified implementation that creates a minimal batch transition.
 * In production, you would need to properly construct the document transitions.
 * @param {string} owner_id
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function create_document_batch_transition(owner_id, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(owner_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.create_document_batch_transition(retptr, ptr0, len0, addHeapObject(signature_public_key_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a group state transition info object
 * @param {number} group_contract_position
 * @param {string | null | undefined} action_id
 * @param {boolean} is_proposer
 * @returns {any}
 */
export function createGroupStateTransitionInfo(group_contract_position, action_id, is_proposer) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(action_id) ? 0 : passStringToWasm0(action_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        wasm.createGroupStateTransitionInfo(retptr, group_contract_position, ptr0, len0, is_proposer);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a token event for group actions
 * @param {string} event_type
 * @param {number} token_position
 * @param {number | null} [amount]
 * @param {string | null} [recipient_id]
 * @param {string | null} [note]
 * @returns {Uint8Array}
 */
export function createTokenEventBytes(event_type, token_position, amount, recipient_id, note) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(recipient_id) ? 0 : passStringToWasm0(recipient_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(note) ? 0 : passStringToWasm0(note, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len2 = WASM_VECTOR_LEN;
        wasm.createTokenEventBytes(retptr, ptr0, len0, token_position, !isLikeNone(amount), isLikeNone(amount) ? 0 : amount, ptr1, len1, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a group action
 * @param {string} contract_id
 * @param {string} proposer_id
 * @param {number} token_position
 * @param {Uint8Array} event_bytes
 * @returns {Uint8Array}
 */
export function createGroupAction(contract_id, proposer_id, token_position, event_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(proposer_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(event_bytes, wasm.__wbindgen_export_0);
        const len2 = WASM_VECTOR_LEN;
        wasm.createGroupAction(retptr, ptr0, len0, ptr1, len1, token_position, ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Add group info to a state transition
 * @param {Uint8Array} state_transition_bytes
 * @param {any} group_info
 * @returns {Uint8Array}
 */
export function addGroupInfoToStateTransition(state_transition_bytes, group_info) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(state_transition_bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.addGroupInfoToStateTransition(retptr, ptr0, len0, addHeapObject(group_info));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get group info from a state transition
 * @param {Uint8Array} state_transition_bytes
 * @returns {any}
 */
export function getGroupInfoFromStateTransition(state_transition_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(state_transition_bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.getGroupInfoFromStateTransition(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a group member structure
 * @param {string} identity_id
 * @param {number} power
 * @returns {any}
 */
export function createGroupMember(identity_id, power) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.createGroupMember(retptr, ptr0, len0, power);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Validate group configuration
 * @param {any} members
 * @param {number} required_power
 * @param {number | null} [member_power_limit]
 * @returns {any}
 */
export function validateGroupConfig(members, required_power, member_power_limit) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.validateGroupConfig(retptr, addHeapObject(members), required_power, isLikeNone(member_power_limit) ? 0xFFFFFF : member_power_limit);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Calculate if a group action has enough approvals
 * @param {any} approvals
 * @param {number} required_power
 * @returns {any}
 */
export function calculateGroupActionApproval(approvals, required_power) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateGroupActionApproval(retptr, addHeapObject(approvals), required_power);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Helper to create a group configuration for data contracts
 * @param {number} position
 * @param {number} required_power
 * @param {number | null | undefined} member_power_limit
 * @param {any} members
 * @returns {any}
 */
export function createGroupConfiguration(position, required_power, member_power_limit, members) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.createGroupConfiguration(retptr, position, required_power, isLikeNone(member_power_limit) ? 0xFFFFFF : member_power_limit, addHeapObject(members));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Deserialize a group event from bytes
 * @param {Uint8Array} event_bytes
 * @returns {any}
 */
export function deserializeGroupEvent(event_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(event_bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.deserializeGroupEvent(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Serialize a group event from JavaScript object
 * @param {any} event_obj
 * @returns {Uint8Array}
 */
export function serializeGroupEvent(event_obj) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.serializeGroupEvent(retptr, addHeapObject(event_obj));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a new identity with an asset lock proof
 * @param {Uint8Array} asset_lock_proof_bytes
 * @param {any} public_keys
 * @returns {Uint8Array}
 */
export function createIdentity(asset_lock_proof_bytes, public_keys) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(asset_lock_proof_bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.createIdentity(retptr, ptr0, len0, addHeapObject(public_keys));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Top up an existing identity with additional credits
 * @param {string} identity_id
 * @param {Uint8Array} asset_lock_proof_bytes
 * @returns {Uint8Array}
 */
export function topUpIdentity(identity_id, asset_lock_proof_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(asset_lock_proof_bytes, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.topUpIdentity(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Update an existing identity (add/remove keys, etc.)
 * @param {string} identity_id
 * @param {bigint} revision
 * @param {bigint} nonce
 * @param {any} _add_public_keys
 * @param {any} _disable_public_keys
 * @param {bigint | null | undefined} _public_keys_disabled_at
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function update_identity(identity_id, revision, nonce, _add_public_keys, _disable_public_keys, _public_keys_disabled_at, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.update_identity(retptr, ptr0, len0, revision, nonce, addHeapObject(_add_public_keys), addHeapObject(_disable_public_keys), !isLikeNone(_public_keys_disabled_at), isLikeNone(_public_keys_disabled_at) ? BigInt(0) : _public_keys_disabled_at, addHeapObject(signature_public_key_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a simple identity with a single ECDSA authentication key
 * @param {Uint8Array} asset_lock_proof_bytes
 * @param {Uint8Array} public_key_data
 * @returns {Uint8Array}
 */
export function createBasicIdentity(asset_lock_proof_bytes, public_key_data) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(asset_lock_proof_bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(public_key_data, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.createBasicIdentity(retptr, ptr0, len0, ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Helper to create a standard identity public key configuration
 * @returns {any}
 */
export function createStandardIdentityKeys() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.createStandardIdentityKeys(retptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Validate public keys for identity creation
 * @param {any} public_keys
 * @returns {any}
 */
export function validateIdentityPublicKeys(public_keys) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.validateIdentityPublicKeys(retptr, addHeapObject(public_keys));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Serialize any state transition to bytes
 * @param {Uint8Array} state_transition_bytes
 * @returns {Uint8Array}
 */
export function serializeStateTransition(state_transition_bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.serializeStateTransition(retptr, addBorrowedObject(state_transition_bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Deserialize state transition from bytes
 * @param {Uint8Array} bytes
 * @returns {any}
 */
export function deserializeStateTransition(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.deserializeStateTransition(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Get the type of a serialized state transition
 * @param {Uint8Array} bytes
 * @returns {StateTransitionTypeWasm}
 */
export function getStateTransitionType(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getStateTransitionType(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Calculate the hash of a state transition
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function calculateStateTransitionId(bytes) {
    let deferred2_0;
    let deferred2_1;
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateStateTransitionId(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        var ptr1 = r0;
        var len1 = r1;
        if (r3) {
            ptr1 = 0; len1 = 0;
            throw takeObject(r2);
        }
        deferred2_0 = ptr1;
        deferred2_1 = len1;
        return getStringFromWasm0(ptr1, len1);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Validate a state transition (basic validation without state)
 * @param {Uint8Array} bytes
 * @returns {any}
 */
export function validateStateTransitionStructure(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.validateStateTransitionStructure(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Check if a state transition requires an identity signature
 * @param {Uint8Array} bytes
 * @returns {boolean}
 */
export function isIdentitySignedStateTransition(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.isIdentitySignedStateTransition(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return r0 !== 0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Get the identity ID associated with a state transition (if applicable)
 * @param {Uint8Array} bytes
 * @returns {string | undefined}
 */
export function getStateTransitionIdentityId(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getStateTransitionIdentityId(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        let v1;
        if (r0 !== 0) {
            v1 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        }
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Get modified data IDs from a state transition
 * @param {Uint8Array} bytes
 * @returns {any}
 */
export function getModifiedDataIds(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getModifiedDataIds(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Extract signable bytes from a state transition (for signing)
 * @param {Uint8Array} bytes
 * @returns {Uint8Array}
 */
export function getStateTransitionSignableBytes(bytes) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.getStateTransitionSignableBytes(retptr, addBorrowedObject(bytes));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to identity balance updates
 * @param {string} identity_id
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandle}
 */
export function subscribeToIdentityBalanceUpdates(identity_id, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.subscribeToIdentityBalanceUpdates(retptr, ptr0, len0, addBorrowedObject(callback), ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandle.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to data contract updates
 * @param {string} contract_id
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandle}
 */
export function subscribeToDataContractUpdates(contract_id, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.subscribeToDataContractUpdates(retptr, ptr0, len0, addBorrowedObject(callback), ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandle.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to document updates
 * @param {string} contract_id
 * @param {string} document_type
 * @param {any} where_clause
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandle}
 */
export function subscribeToDocumentUpdates(contract_id, document_type, where_clause, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len2 = WASM_VECTOR_LEN;
        wasm.subscribeToDocumentUpdates(retptr, ptr0, len0, ptr1, len1, addHeapObject(where_clause), addBorrowedObject(callback), ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandle.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to block headers
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandle}
 */
export function subscribeToBlockHeaders(callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        wasm.subscribeToBlockHeaders(retptr, addBorrowedObject(callback), ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandle.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to state transition results
 * @param {string} state_transition_hash
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandle}
 */
export function subscribeToStateTransitionResults(state_transition_hash, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(state_transition_hash, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.subscribeToStateTransitionResults(retptr, ptr0, len0, addBorrowedObject(callback), ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandle.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to identity balance updates with automatic cleanup
 * @param {string} identity_id
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandleV2}
 */
export function subscribeToIdentityBalanceUpdatesV2(identity_id, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.subscribeToIdentityBalanceUpdatesV2(retptr, ptr0, len0, addBorrowedObject(callback), ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandleV2.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to data contract updates with automatic cleanup
 * @param {string} contract_id
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandleV2}
 */
export function subscribeToDataContractUpdatesV2(contract_id, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.subscribeToDataContractUpdatesV2(retptr, ptr0, len0, addBorrowedObject(callback), ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandleV2.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe to document updates with automatic cleanup
 * @param {string} contract_id
 * @param {string} document_type
 * @param {any} where_clause
 * @param {Function} callback
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandleV2}
 */
export function subscribeToDocumentUpdatesV2(contract_id, document_type, where_clause, callback, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len2 = WASM_VECTOR_LEN;
        wasm.subscribeToDocumentUpdatesV2(retptr, ptr0, len0, ptr1, len1, addHeapObject(where_clause), addBorrowedObject(callback), ptr2, len2);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandleV2.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Subscribe with custom error and close handlers
 * @param {string} subscription_type
 * @param {any} params
 * @param {Function} on_message
 * @param {Function | null} [on_error]
 * @param {Function | null} [on_close]
 * @param {string | null} [endpoint]
 * @returns {SubscriptionHandleV2}
 */
export function subscribeWithHandlersV2(subscription_type, params, on_message, on_error, on_close, endpoint) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(subscription_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(endpoint) ? 0 : passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        wasm.subscribeWithHandlersV2(retptr, ptr0, len0, addHeapObject(params), addBorrowedObject(on_message), isLikeNone(on_error) ? 0 : addHeapObject(on_error), isLikeNone(on_close) ? 0 : addHeapObject(on_close), ptr1, len1);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SubscriptionHandleV2.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Clean up all active subscriptions
 */
export function cleanupAllSubscriptions() {
    wasm.cleanupAllSubscriptions();
}

/**
 * Get count of active subscriptions
 * @returns {number}
 */
export function getActiveSubscriptionCount() {
    const ret = wasm.getActiveSubscriptionCount();
    return ret >>> 0;
}

/**
 * Mint new tokens
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {number} amount
 * @param {string} recipient_identity_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function mintTokens(sdk, token_id, amount, recipient_identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(recipient_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    let ptr2 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr2 = options.__destroy_into_raw();
    }
    const ret = wasm.mintTokens(sdk.__wbg_ptr, ptr0, len0, amount, ptr1, len1, ptr2);
    return takeObject(ret);
}

/**
 * Burn tokens
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {number} amount
 * @param {string} owner_identity_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function burnTokens(sdk, token_id, amount, owner_identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(owner_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    let ptr2 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr2 = options.__destroy_into_raw();
    }
    const ret = wasm.burnTokens(sdk.__wbg_ptr, ptr0, len0, amount, ptr1, len1, ptr2);
    return takeObject(ret);
}

/**
 * Transfer tokens between identities
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {number} amount
 * @param {string} sender_identity_id
 * @param {string} recipient_identity_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function transferTokens(sdk, token_id, amount, sender_identity_id, recipient_identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(sender_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(recipient_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len2 = WASM_VECTOR_LEN;
    let ptr3 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr3 = options.__destroy_into_raw();
    }
    const ret = wasm.transferTokens(sdk.__wbg_ptr, ptr0, len0, amount, ptr1, len1, ptr2, len2, ptr3);
    return takeObject(ret);
}

/**
 * Freeze tokens for an identity
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {string} identity_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function freezeTokens(sdk, token_id, identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    let ptr2 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr2 = options.__destroy_into_raw();
    }
    const ret = wasm.freezeTokens(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2);
    return takeObject(ret);
}

/**
 * Unfreeze tokens for an identity
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {string} identity_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function unfreezeTokens(sdk, token_id, identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    let ptr2 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr2 = options.__destroy_into_raw();
    }
    const ret = wasm.unfreezeTokens(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2);
    return takeObject(ret);
}

/**
 * Get token balance for an identity
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {string} identity_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function getTokenBalance(sdk, token_id, identity_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    let ptr2 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr2 = options.__destroy_into_raw();
    }
    const ret = wasm.getTokenBalance(sdk.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2);
    return takeObject(ret);
}

/**
 * Get token information
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function getTokenInfo(sdk, token_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.getTokenInfo(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Create a token issuance state transition
 * @param {string} data_contract_id
 * @param {number} token_position
 * @param {number} amount
 * @param {number} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createTokenIssuance(data_contract_id, token_position, amount, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(data_contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.createTokenIssuance(retptr, ptr0, len0, token_position, amount, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a token burn state transition
 * @param {string} data_contract_id
 * @param {number} token_position
 * @param {number} amount
 * @param {number} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createTokenBurn(data_contract_id, token_position, amount, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(data_contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.createTokenBurn(retptr, ptr0, len0, token_position, amount, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get all tokens for a data contract
 * @param {WasmSdk} sdk
 * @param {string} data_contract_id
 * @param {TokenOptions | null} [options]
 * @returns {Promise<any>}
 */
export function getContractTokens(sdk, data_contract_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(data_contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, TokenOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.getContractTokens(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Get token holders for a specific token
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {number | null} [limit]
 * @param {number | null} [offset]
 * @returns {Promise<any>}
 */
export function getTokenHolders(sdk, token_id, limit, offset) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getTokenHolders(sdk.__wbg_ptr, ptr0, len0, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, isLikeNone(offset) ? 0x100000001 : (offset) >>> 0);
    return takeObject(ret);
}

/**
 * Get token transaction history
 * @param {WasmSdk} sdk
 * @param {string} token_id
 * @param {number | null} [limit]
 * @param {number | null} [offset]
 * @returns {Promise<any>}
 */
export function getTokenTransactions(sdk, token_id, limit, offset) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getTokenTransactions(sdk.__wbg_ptr, ptr0, len0, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, isLikeNone(offset) ? 0x100000001 : (offset) >>> 0);
    return takeObject(ret);
}

/**
 * Create batch token transfer state transition
 * @param {string} token_id
 * @param {string} sender_identity_id
 * @param {any} transfers
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createBatchTokenTransfer(token_id, sender_identity_id, transfers, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(sender_identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.createBatchTokenTransfer(retptr, ptr0, len0, ptr1, len1, addHeapObject(transfers), identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Monitor token events
 * @param {WasmSdk} _sdk
 * @param {string} token_id
 * @param {Array<any> | null | undefined} event_types
 * @param {Function} callback
 * @returns {Promise<any>}
 */
export function monitorTokenEvents(_sdk, token_id, event_types, callback) {
    _assertClass(_sdk, WasmSdk);
    const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.monitorTokenEvents(_sdk.__wbg_ptr, ptr0, len0, isLikeNone(event_types) ? 0 : addHeapObject(event_types), addHeapObject(callback));
    return takeObject(ret);
}

/**
 * @param {Uint8Array} proof
 * @param {string} identity_id
 * @param {boolean} is_proof_subset
 * @param {number} platform_version
 * @returns {Promise<IdentityWasm>}
 */
export function verify_identity_by_id(proof, identity_id, is_proof_subset, platform_version) {
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.verify_identity_by_id(addHeapObject(proof), ptr0, len0, is_proof_subset, platform_version);
    return takeObject(ret);
}

/**
 * @param {Uint8Array} proof
 * @param {string} contract_id
 * @param {boolean} is_proof_subset
 * @param {number} platform_version
 * @returns {Promise<DataContractWasm>}
 */
export function verify_data_contract_by_id(proof, contract_id, is_proof_subset, platform_version) {
    const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.verify_data_contract_by_id(addHeapObject(proof), ptr0, len0, is_proof_subset, platform_version);
    return takeObject(ret);
}

/**
 * Verify documents proof and return verified documents
 *
 * Note: This function requires the data contract to be provided separately
 * because document queries need the contract schema for proper validation.
 * @param {Uint8Array} _proof
 * @param {string} _contract_id
 * @param {string} _document_type
 * @param {any} _where_clause
 * @param {any} _order_by
 * @param {number | null} [_limit]
 * @param {Uint8Array | null} [_start_at]
 * @returns {any}
 */
export function verifyDocuments(_proof, _contract_id, _document_type, _where_clause, _order_by, _limit, _start_at) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(_proof, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(_contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(_document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(_start_at) ? 0 : passArray8ToWasm0(_start_at, wasm.__wbindgen_export_0);
        var len3 = WASM_VECTOR_LEN;
        wasm.verifyDocuments(retptr, ptr0, len0, ptr1, len1, ptr2, len2, addHeapObject(_where_clause), addHeapObject(_order_by), isLikeNone(_limit) ? 0x100000001 : (_limit) >>> 0, ptr3, len3);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Verify documents proof with a provided contract
 * @param {Uint8Array} _proof
 * @param {Uint8Array} contract_cbor
 * @param {string} _document_type
 * @param {any} where_clause
 * @param {any} order_by
 * @param {number | null} [_limit]
 * @param {Uint8Array | null} [_start_at]
 * @returns {any}
 */
export function verifyDocumentsWithContract(_proof, contract_cbor, _document_type, where_clause, order_by, _limit, _start_at) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(_proof, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(contract_cbor, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(_document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        var ptr3 = isLikeNone(_start_at) ? 0 : passArray8ToWasm0(_start_at, wasm.__wbindgen_export_0);
        var len3 = WASM_VECTOR_LEN;
        wasm.verifyDocumentsWithContract(retptr, ptr0, len0, ptr1, len1, ptr2, len2, addHeapObject(where_clause), addHeapObject(order_by), isLikeNone(_limit) ? 0x100000001 : (_limit) >>> 0, ptr3, len3);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Verify documents using a serialized query approach
 *
 * This function provides a bridge to wasm-drive-verify that avoids
 * the need for direct drive type dependencies.
 * @param {Uint8Array} _proof
 * @param {VerifyDocumentQuery} _query
 * @returns {DocumentVerificationResult}
 */
export function verifyDocumentsBridge(_proof, _query) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(_proof, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(_query, VerifyDocumentQuery);
        wasm.verifyDocumentsBridge(retptr, ptr0, len0, _query.__wbg_ptr);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return DocumentVerificationResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Helper function to verify a single document
 *
 * This is a simpler case that might be easier to implement
 * @param {Uint8Array} _proof
 * @param {Uint8Array} contract_cbor
 * @param {string} _document_type
 * @param {Uint8Array} document_id
 * @returns {any}
 */
export function verifySingleDocument(_proof, contract_cbor, _document_type, document_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(_proof, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(contract_cbor, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(_document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArray8ToWasm0(document_id, wasm.__wbindgen_export_0);
        const len3 = WASM_VECTOR_LEN;
        wasm.verifySingleDocument(retptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a vote state transition
 * @param {string} voter_id
 * @param {string} poll_id
 * @param {VoteChoice} vote_choice
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createVoteTransition(voter_id, poll_id, vote_choice, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(voter_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(poll_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        _assertClass(vote_choice, VoteChoice);
        wasm.createVoteTransition(retptr, ptr0, len0, ptr1, len1, vote_choice.__wbg_ptr, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Fetch active vote polls
 * @param {WasmSdk} sdk
 * @param {number | null} [limit]
 * @returns {Promise<Array<any>>}
 */
export function fetchActiveVotePolls(sdk, limit) {
    _assertClass(sdk, WasmSdk);
    const ret = wasm.fetchActiveVotePolls(sdk.__wbg_ptr, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0);
    return takeObject(ret);
}

/**
 * Fetch vote poll by ID
 * @param {WasmSdk} sdk
 * @param {string} poll_id
 * @returns {Promise<VotePoll>}
 */
export function fetchVotePoll(sdk, poll_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(poll_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchVotePoll(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Fetch vote results
 * @param {WasmSdk} sdk
 * @param {string} poll_id
 * @returns {Promise<VoteResult>}
 */
export function fetchVoteResults(sdk, poll_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(poll_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.fetchVoteResults(sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Check if identity has voted
 * @param {WasmSdk} _sdk
 * @param {string} voter_id
 * @param {string} poll_id
 * @returns {Promise<boolean>}
 */
export function hasVoted(_sdk, voter_id, poll_id) {
    _assertClass(_sdk, WasmSdk);
    const ptr0 = passStringToWasm0(voter_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(poll_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.hasVoted(_sdk.__wbg_ptr, ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

/**
 * Get voter's vote
 * @param {WasmSdk} sdk
 * @param {string} voter_id
 * @param {string} poll_id
 * @returns {Promise<string | undefined>}
 */
export function getVoterVote(sdk, voter_id, poll_id) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(voter_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(poll_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.getVoterVote(sdk.__wbg_ptr, ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

/**
 * Delegate voting power
 * @param {string} delegator_id
 * @param {string} delegate_id
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function delegateVotingPower(delegator_id, delegate_id, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(delegator_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(delegate_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.delegateVotingPower(retptr, ptr0, len0, ptr1, len1, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v3 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v3;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Revoke voting delegation
 * @param {string} delegator_id
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function revokeVotingDelegation(delegator_id, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(delegator_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.revokeVotingDelegation(retptr, ptr0, len0, identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v2 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a new vote poll
 * @param {string} creator_id
 * @param {string} title
 * @param {string} description
 * @param {number} duration_days
 * @param {Array<any>} vote_options
 * @param {bigint} identity_nonce
 * @param {number} signature_public_key_id
 * @returns {Uint8Array}
 */
export function createVotePoll(creator_id, title, description, duration_days, vote_options, identity_nonce, signature_public_key_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(creator_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(title, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(description, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        wasm.createVotePoll(retptr, ptr0, len0, ptr1, len1, ptr2, len2, duration_days, addHeapObject(vote_options), identity_nonce, signature_public_key_id);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get voting power for an identity
 * @param {WasmSdk} _sdk
 * @param {string} identity_id
 * @returns {Promise<number>}
 */
export function getVotingPower(_sdk, identity_id) {
    _assertClass(_sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.getVotingPower(_sdk.__wbg_ptr, ptr0, len0);
    return takeObject(ret);
}

/**
 * Monitor vote poll for changes
 * @param {WasmSdk} sdk
 * @param {string} poll_id
 * @param {Function} callback
 * @param {number | null} [poll_interval_ms]
 * @returns {Promise<any>}
 */
export function monitorVotePoll(sdk, poll_id, callback, poll_interval_ms) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(poll_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.monitorVotePoll(sdk.__wbg_ptr, ptr0, len0, addHeapObject(callback), isLikeNone(poll_interval_ms) ? 0x100000001 : (poll_interval_ms) >>> 0);
    return takeObject(ret);
}

/**
 * Create a withdrawal from an identity
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {number} amount
 * @param {string} to_address
 * @param {number} signature_public_key_id
 * @param {WithdrawalOptions | null} [options]
 * @returns {Promise<any>}
 */
export function withdrawFromIdentity(sdk, identity_id, amount, to_address, signature_public_key_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(to_address, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len1 = WASM_VECTOR_LEN;
    let ptr2 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, WithdrawalOptions);
        ptr2 = options.__destroy_into_raw();
    }
    const ret = wasm.withdrawFromIdentity(sdk.__wbg_ptr, ptr0, len0, amount, ptr1, len1, signature_public_key_id, ptr2);
    return takeObject(ret);
}

/**
 * Create a withdrawal state transition
 * @param {string} identity_id
 * @param {number} amount
 * @param {string} to_address
 * @param {Uint8Array} output_script
 * @param {number} identity_nonce
 * @param {number} signature_public_key_id
 * @param {number | null} [core_fee_per_byte]
 * @returns {Uint8Array}
 */
export function createWithdrawalTransition(identity_id, amount, to_address, output_script, identity_nonce, signature_public_key_id, core_fee_per_byte) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(to_address, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(output_script, wasm.__wbindgen_export_0);
        const len2 = WASM_VECTOR_LEN;
        wasm.createWithdrawalTransition(retptr, ptr0, len0, amount, ptr1, len1, ptr2, len2, identity_nonce, signature_public_key_id, isLikeNone(core_fee_per_byte) ? 0x100000001 : (core_fee_per_byte) >>> 0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        var v4 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_export_3(r0, r1 * 1, 1);
        return v4;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Get withdrawal status
 * @param {WasmSdk} sdk
 * @param {string} withdrawal_id
 * @param {WithdrawalOptions | null} [options]
 * @returns {Promise<any>}
 */
export function getWithdrawalStatus(sdk, withdrawal_id, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(withdrawal_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, WithdrawalOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.getWithdrawalStatus(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Get all withdrawals for an identity
 * @param {WasmSdk} sdk
 * @param {string} identity_id
 * @param {number | null} [limit]
 * @param {number | null} [offset]
 * @param {WithdrawalOptions | null} [options]
 * @returns {Promise<any>}
 */
export function getIdentityWithdrawals(sdk, identity_id, limit, offset, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, WithdrawalOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.getIdentityWithdrawals(sdk.__wbg_ptr, ptr0, len0, isLikeNone(limit) ? 0x100000001 : (limit) >>> 0, isLikeNone(offset) ? 0x100000001 : (offset) >>> 0, ptr1);
    return takeObject(ret);
}

/**
 * Calculate withdrawal fee
 * @param {number} amount
 * @param {number} output_script_size
 * @param {number | null} [core_fee_per_byte]
 * @returns {number}
 */
export function calculateWithdrawalFee(amount, output_script_size, core_fee_per_byte) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.calculateWithdrawalFee(retptr, amount, output_script_size, isLikeNone(core_fee_per_byte) ? 0x100000001 : (core_fee_per_byte) >>> 0);
        var r0 = getDataViewMemory0().getFloat64(retptr + 8 * 0, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
        if (r3) {
            throw takeObject(r2);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Broadcast a withdrawal transaction
 * @param {WasmSdk} sdk
 * @param {Uint8Array} withdrawal_transition
 * @param {WithdrawalOptions | null} [options]
 * @returns {Promise<any>}
 */
export function broadcastWithdrawal(sdk, withdrawal_transition, options) {
    _assertClass(sdk, WasmSdk);
    const ptr0 = passArray8ToWasm0(withdrawal_transition, wasm.__wbindgen_export_0);
    const len0 = WASM_VECTOR_LEN;
    let ptr1 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, WithdrawalOptions);
        ptr1 = options.__destroy_into_raw();
    }
    const ret = wasm.broadcastWithdrawal(sdk.__wbg_ptr, ptr0, len0, ptr1);
    return takeObject(ret);
}

/**
 * Estimate time until withdrawal is processed
 * @param {WasmSdk} sdk
 * @param {WithdrawalOptions | null} [options]
 * @returns {Promise<any>}
 */
export function estimateWithdrawalTime(sdk, options) {
    _assertClass(sdk, WasmSdk);
    let ptr0 = 0;
    if (!isLikeNone(options)) {
        _assertClass(options, WithdrawalOptions);
        ptr0 = options.__destroy_into_raw();
    }
    const ret = wasm.estimateWithdrawalTime(sdk.__wbg_ptr, ptr0);
    return takeObject(ret);
}

/**
 * @param {Uint8Array} proof
 * @param {any} public_key_hashes
 * @param {number} platform_version_number
 * @returns {VerifyFullIdentitiesByPublicKeyHashesResult}
 */
export function verifyFullIdentitiesByPublicKeyHashesVec(proof, public_key_hashes, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyFullIdentitiesByPublicKeyHashesVec(retptr, addBorrowedObject(proof), addBorrowedObject(public_key_hashes), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyFullIdentitiesByPublicKeyHashesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} public_key_hashes
 * @param {number} platform_version_number
 * @returns {VerifyFullIdentitiesByPublicKeyHashesResult}
 */
export function verifyFullIdentitiesByPublicKeyHashesMap(proof, public_key_hashes, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyFullIdentitiesByPublicKeyHashesMap(retptr, addBorrowedObject(proof), addBorrowedObject(public_key_hashes), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyFullIdentitiesByPublicKeyHashesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {Uint8Array} identity_id
 * @param {number} platform_version_number
 * @returns {VerifyFullIdentityByIdentityIdResult}
 */
export function verifyFullIdentityByIdentityId(proof, is_proof_subset, identity_id, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyFullIdentityByIdentityId(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(identity_id), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyFullIdentityByIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array | null | undefined} identity_proof
 * @param {Uint8Array} identity_id_public_key_hash_proof
 * @param {Uint8Array} public_key_hash
 * @param {Uint8Array | null | undefined} after
 * @param {number} platform_version_number
 * @returns {VerifyFullIdentityByNonUniquePublicKeyHashResult}
 */
export function verifyFullIdentityByNonUniquePublicKeyHash(identity_proof, identity_id_public_key_hash_proof, public_key_hash, after, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyFullIdentityByNonUniquePublicKeyHash(retptr, isLikeNone(identity_proof) ? 0 : addHeapObject(identity_proof), addBorrowedObject(identity_id_public_key_hash_proof), addBorrowedObject(public_key_hash), isLikeNone(after) ? 0 : addHeapObject(after), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyFullIdentityByNonUniquePublicKeyHashResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} public_key_hash
 * @param {number} platform_version_number
 * @returns {VerifyFullIdentityByUniquePublicKeyHashResult}
 */
export function verifyFullIdentityByUniquePublicKeyHash(proof, public_key_hash, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyFullIdentityByUniquePublicKeyHash(retptr, addBorrowedObject(proof), addBorrowedObject(public_key_hash), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyFullIdentityByUniquePublicKeyHashResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Array<any>} identity_ids
 * @param {Uint8Array} contract_id
 * @param {string | null | undefined} document_type_name
 * @param {Array<any>} purposes
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyIdentitiesContractKeysResult}
 */
export function verifyIdentitiesContractKeys(proof, identity_ids, contract_id, document_type_name, purposes, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(document_type_name) ? 0 : passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        wasm.verifyIdentitiesContractKeys(retptr, addBorrowedObject(proof), addBorrowedObject(identity_ids), addBorrowedObject(contract_id), ptr0, len0, addBorrowedObject(purposes), is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentitiesContractKeysResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyIdentityBalanceAndRevisionForIdentityIdResult}
 */
export function verifyIdentityBalanceAndRevisionForIdentityId(proof, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityBalanceAndRevisionForIdentityId(retptr, addBorrowedObject(proof), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityBalanceAndRevisionForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyIdentityBalanceForIdentityIdResult}
 */
export function verifyIdentityBalanceForIdentityId(proof, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityBalanceForIdentityId(retptr, addBorrowedObject(proof), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityBalanceForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {any} identity_ids
 * @param {number} platform_version_number
 * @returns {VerifyIdentityBalancesForIdentityIdsResult}
 */
export function verifyIdentityBalancesForIdentityIdsVec(proof, is_proof_subset, identity_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityBalancesForIdentityIdsVec(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(identity_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityBalancesForIdentityIdsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {any} identity_ids
 * @param {number} platform_version_number
 * @returns {VerifyIdentityBalancesForIdentityIdsResult}
 */
export function verifyIdentityBalancesForIdentityIdsMap(proof, is_proof_subset, identity_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityBalancesForIdentityIdsMap(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(identity_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityBalancesForIdentityIdsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} identity_id
 * @param {Uint8Array} contract_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyIdentityContractNonceResult}
 */
export function verifyIdentityContractNonce(proof, identity_id, contract_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityContractNonce(retptr, addBorrowedObject(proof), addBorrowedObject(identity_id), addBorrowedObject(contract_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityContractNonceResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {Uint8Array} public_key_hash
 * @param {Uint8Array | null | undefined} after
 * @param {number} platform_version_number
 * @returns {VerifyIdentityIdByNonUniquePublicKeyHashResult}
 */
export function verifyIdentityIdByNonUniquePublicKeyHash(proof, is_proof_subset, public_key_hash, after, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityIdByNonUniquePublicKeyHash(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(public_key_hash), isLikeNone(after) ? 0 : addHeapObject(after), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityIdByNonUniquePublicKeyHashResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {Uint8Array} public_key_hash
 * @param {number} platform_version_number
 * @returns {VerifyIdentityIdByUniquePublicKeyHashResult}
 */
export function verifyIdentityIdByUniquePublicKeyHash(proof, is_proof_subset, public_key_hash, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityIdByUniquePublicKeyHash(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(public_key_hash), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityIdByUniquePublicKeyHashResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {any} public_key_hashes
 * @param {number} platform_version_number
 * @returns {VerifyIdentityIdsByUniquePublicKeyHashesResult}
 */
export function verifyIdentityIdsByUniquePublicKeyHashesVec(proof, is_proof_subset, public_key_hashes, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityIdsByUniquePublicKeyHashesVec(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(public_key_hashes), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityIdsByUniquePublicKeyHashesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean} is_proof_subset
 * @param {any} public_key_hashes
 * @param {number} platform_version_number
 * @returns {VerifyIdentityIdsByUniquePublicKeyHashesResult}
 */
export function verifyIdentityIdsByUniquePublicKeyHashesMap(proof, is_proof_subset, public_key_hashes, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityIdsByUniquePublicKeyHashesMap(retptr, addBorrowedObject(proof), is_proof_subset, addBorrowedObject(public_key_hashes), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityIdsByUniquePublicKeyHashesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} identity_id
 * @param {Array<any> | null | undefined} specific_key_ids
 * @param {boolean} with_revision
 * @param {boolean} with_balance
 * @param {boolean} is_proof_subset
 * @param {number | null | undefined} limit
 * @param {number | null | undefined} offset
 * @param {number} platform_version_number
 * @returns {VerifyIdentityKeysByIdentityIdResult}
 */
export function verifyIdentityKeysByIdentityId(proof, identity_id, specific_key_ids, with_revision, with_balance, is_proof_subset, limit, offset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityKeysByIdentityId(retptr, addBorrowedObject(proof), addBorrowedObject(identity_id), isLikeNone(specific_key_ids) ? 0 : addHeapObject(specific_key_ids), with_revision, with_balance, is_proof_subset, isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(offset) ? 0xFFFFFF : offset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityKeysByIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyIdentityNonceResult}
 */
export function verifyIdentityNonce(proof, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityNonce(retptr, addBorrowedObject(proof), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityNonceResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyIdentityRevisionForIdentityIdResult}
 */
export function verifyIdentityRevisionForIdentityId(proof, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityRevisionForIdentityId(retptr, addBorrowedObject(proof), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityRevisionForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} contract_js
 * @param {string} document_type_name
 * @param {any} where_clauses
 * @param {any} order_by
 * @param {number | null | undefined} limit
 * @param {number | null | undefined} offset
 * @param {Uint8Array | null | undefined} start_at
 * @param {boolean} start_at_included
 * @param {bigint | null | undefined} block_time_ms
 * @param {number} platform_version_number
 * @returns {VerifyDocumentProofResult}
 */
export function verifyDocumentProof(proof, contract_js, document_type_name, where_clauses, order_by, limit, offset, start_at, start_at_included, block_time_ms, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifyDocumentProof(retptr, addBorrowedObject(proof), addBorrowedObject(contract_js), ptr0, len0, addBorrowedObject(where_clauses), addBorrowedObject(order_by), isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(offset) ? 0xFFFFFF : offset, isLikeNone(start_at) ? 0 : addHeapObject(start_at), start_at_included, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? BigInt(0) : block_time_ms, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyDocumentProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} contract_js
 * @param {string} document_type_name
 * @param {any} where_clauses
 * @param {any} order_by
 * @param {number | null | undefined} limit
 * @param {number | null | undefined} offset
 * @param {Uint8Array | null | undefined} start_at
 * @param {boolean} start_at_included
 * @param {bigint | null | undefined} block_time_ms
 * @param {number} platform_version_number
 * @returns {VerifyDocumentProofKeepSerializedResult}
 */
export function verifyDocumentProofKeepSerialized(proof, contract_js, document_type_name, where_clauses, order_by, limit, offset, start_at, start_at_included, block_time_ms, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifyDocumentProofKeepSerialized(retptr, addBorrowedObject(proof), addBorrowedObject(contract_js), ptr0, len0, addBorrowedObject(where_clauses), addBorrowedObject(order_by), isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(offset) ? 0xFFFFFF : offset, isLikeNone(start_at) ? 0 : addHeapObject(start_at), start_at_included, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? BigInt(0) : block_time_ms, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyDocumentProofKeepSerializedResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} contract_js
 * @param {string} document_type_name
 * @param {any} where_clauses
 * @param {any} order_by
 * @param {number | null | undefined} limit
 * @param {number | null | undefined} offset
 * @param {Uint8Array | null | undefined} start_at
 * @param {boolean} start_at_included
 * @param {bigint | null | undefined} block_time_ms
 * @param {boolean} is_proof_subset
 * @param {Uint8Array} document_id
 * @param {number} platform_version_number
 * @returns {VerifyStartAtDocumentInProofResult}
 */
export function verifyStartAtDocumentInProof(proof, contract_js, document_type_name, where_clauses, order_by, limit, offset, start_at, start_at_included, block_time_ms, is_proof_subset, document_id, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifyStartAtDocumentInProof(retptr, addBorrowedObject(proof), addBorrowedObject(contract_js), ptr0, len0, addBorrowedObject(where_clauses), addBorrowedObject(order_by), isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(offset) ? 0xFFFFFF : offset, isLikeNone(start_at) ? 0 : addHeapObject(start_at), start_at_included, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? BigInt(0) : block_time_ms, is_proof_subset, addBorrowedObject(document_id), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyStartAtDocumentInProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify a single document proof and keep it serialized
 * @param {SingleDocumentDriveQueryWasm} query
 * @param {boolean} is_subset
 * @param {Uint8Array} proof
 * @param {number} platform_version_number
 * @returns {SingleDocumentProofResult}
 */
export function verifySingleDocumentProofKeepSerialized(query, is_subset, proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(query, SingleDocumentDriveQueryWasm);
        const ptr0 = passArray8ToWasm0(proof, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifySingleDocumentProofKeepSerialized(retptr, query.__wbg_ptr, is_subset, ptr0, len0, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SingleDocumentProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a SingleDocumentDriveQuery for a non-contested document
 * @param {Uint8Array} contract_id
 * @param {string} document_type_name
 * @param {boolean} document_type_keeps_history
 * @param {Uint8Array} document_id
 * @param {number | null} [block_time_ms]
 * @returns {SingleDocumentDriveQueryWasm}
 */
export function createSingleDocumentQuery(contract_id, document_type_name, document_type_keeps_history, document_id, block_time_ms) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(contract_id, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(document_id, wasm.__wbindgen_export_0);
        const len2 = WASM_VECTOR_LEN;
        wasm.createSingleDocumentQuery(retptr, ptr0, len0, ptr1, len1, document_type_keeps_history, ptr2, len2, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? 0 : block_time_ms);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SingleDocumentDriveQueryWasm.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a SingleDocumentDriveQuery for a maybe contested document
 * @param {Uint8Array} contract_id
 * @param {string} document_type_name
 * @param {boolean} document_type_keeps_history
 * @param {Uint8Array} document_id
 * @param {number | null} [block_time_ms]
 * @returns {SingleDocumentDriveQueryWasm}
 */
export function createSingleDocumentQueryMaybeContested(contract_id, document_type_name, document_type_keeps_history, document_id, block_time_ms) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(contract_id, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(document_id, wasm.__wbindgen_export_0);
        const len2 = WASM_VECTOR_LEN;
        wasm.createSingleDocumentQueryMaybeContested(retptr, ptr0, len0, ptr1, len1, document_type_keeps_history, ptr2, len2, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? 0 : block_time_ms);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SingleDocumentDriveQueryWasm.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * Create a SingleDocumentDriveQuery for a contested document
 * @param {Uint8Array} contract_id
 * @param {string} document_type_name
 * @param {boolean} document_type_keeps_history
 * @param {Uint8Array} document_id
 * @param {number | null} [block_time_ms]
 * @returns {SingleDocumentDriveQueryWasm}
 */
export function createSingleDocumentQueryContested(contract_id, document_type_name, document_type_keeps_history, document_id, block_time_ms) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(contract_id, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(document_id, wasm.__wbindgen_export_0);
        const len2 = WASM_VECTOR_LEN;
        wasm.createSingleDocumentQueryContested(retptr, ptr0, len0, ptr1, len1, document_type_keeps_history, ptr2, len2, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? 0 : block_time_ms);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return SingleDocumentDriveQueryWasm.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
 * @param {Uint8Array} proof
 * @param {boolean | null | undefined} contract_known_keeps_history
 * @param {boolean} is_proof_subset
 * @param {boolean} in_multiple_contract_proof_form
 * @param {Uint8Array} contract_id
 * @param {number} platform_version_number
 * @returns {VerifyContractResult}
 */
export function verifyContract(proof, contract_known_keeps_history, is_proof_subset, in_multiple_contract_proof_form, contract_id, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyContract(retptr, addBorrowedObject(proof), isLikeNone(contract_known_keeps_history) ? 0xFFFFFF : contract_known_keeps_history ? 1 : 0, is_proof_subset, in_multiple_contract_proof_form, addBorrowedObject(contract_id), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyContractResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {bigint} start_at_date
 * @param {number | null | undefined} limit
 * @param {number | null | undefined} offset
 * @param {number} platform_version_number
 * @returns {VerifyContractHistoryResult}
 */
export function verifyContractHistory(proof, contract_id, start_at_date, limit, offset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyContractHistory(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), start_at_date, isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(offset) ? 0xFFFFFF : offset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyContractHistoryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenBalancesForIdentityIdResult}
 */
export function verifyTokenBalancesForIdentityIdVec(proof, token_ids, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenBalancesForIdentityIdVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenBalancesForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenBalancesForIdentityIdResult}
 */
export function verifyTokenBalancesForIdentityIdMap(proof, token_ids, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenBalancesForIdentityIdMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenBalancesForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} is_proof_subset
 * @param {any} identity_ids
 * @param {number} platform_version_number
 * @returns {VerifyTokenBalancesForIdentityIdsResult}
 */
export function verifyTokenBalancesForIdentityIdsVec(proof, token_id, is_proof_subset, identity_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenBalancesForIdentityIdsVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), is_proof_subset, addBorrowedObject(identity_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenBalancesForIdentityIdsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} is_proof_subset
 * @param {any} identity_ids
 * @param {number} platform_version_number
 * @returns {VerifyTokenBalancesForIdentityIdsResult}
 */
export function verifyTokenBalancesForIdentityIdsMap(proof, token_id, is_proof_subset, identity_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenBalancesForIdentityIdsMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), is_proof_subset, addBorrowedObject(identity_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenBalancesForIdentityIdsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenDirectSellingPricesResult}
 */
export function verifyTokenDirectSellingPricesVec(proof, token_ids, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenDirectSellingPricesVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenDirectSellingPricesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenDirectSellingPricesResult}
 */
export function verifyTokenDirectSellingPricesMap(proof, token_ids, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenDirectSellingPricesMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenDirectSellingPricesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenInfosForIdentityIdResult}
 */
export function verifyTokenInfosForIdentityIdVec(proof, token_ids, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenInfosForIdentityIdVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenInfosForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenInfosForIdentityIdResult}
 */
export function verifyTokenInfosForIdentityIdMap(proof, token_ids, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenInfosForIdentityIdMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenInfosForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} is_proof_subset
 * @param {any} identity_ids
 * @param {number} platform_version_number
 * @returns {VerifyTokenInfosForIdentityIdsResult}
 */
export function verifyTokenInfosForIdentityIdsVec(proof, token_id, is_proof_subset, identity_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenInfosForIdentityIdsVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), is_proof_subset, addBorrowedObject(identity_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenInfosForIdentityIdsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} is_proof_subset
 * @param {any} identity_ids
 * @param {number} platform_version_number
 * @returns {VerifyTokenInfosForIdentityIdsResult}
 */
export function verifyTokenInfosForIdentityIdsMap(proof, token_id, is_proof_subset, identity_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenInfosForIdentityIdsMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), is_proof_subset, addBorrowedObject(identity_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenInfosForIdentityIdsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {bigint | null | undefined} start_at_timestamp
 * @param {Uint8Array | null | undefined} start_at_identity_id
 * @param {number | null | undefined} limit
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenPreProgrammedDistributionsResult}
 */
export function verifyTokenPreProgrammedDistributionsVec(proof, token_id, start_at_timestamp, start_at_identity_id, limit, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenPreProgrammedDistributionsVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), !isLikeNone(start_at_timestamp), isLikeNone(start_at_timestamp) ? BigInt(0) : start_at_timestamp, isLikeNone(start_at_identity_id) ? 0 : addHeapObject(start_at_identity_id), isLikeNone(limit) ? 0xFFFFFF : limit, verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenPreProgrammedDistributionsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {bigint | null | undefined} start_at_timestamp
 * @param {Uint8Array | null | undefined} start_at_identity_id
 * @param {number | null | undefined} limit
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenPreProgrammedDistributionsResult}
 */
export function verifyTokenPreProgrammedDistributionsMap(proof, token_id, start_at_timestamp, start_at_identity_id, limit, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenPreProgrammedDistributionsMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), !isLikeNone(start_at_timestamp), isLikeNone(start_at_timestamp) ? BigInt(0) : start_at_timestamp, isLikeNone(start_at_identity_id) ? 0 : addHeapObject(start_at_identity_id), isLikeNone(limit) ? 0xFFFFFF : limit, verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenPreProgrammedDistributionsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenStatusesResult}
 */
export function verifyTokenStatusesVec(proof, token_ids, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenStatusesVec(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenStatusesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {any} token_ids
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenStatusesResult}
 */
export function verifyTokenStatusesMap(proof, token_ids, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenStatusesMap(retptr, addBorrowedObject(proof), addBorrowedObject(token_ids), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenStatusesResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenBalanceForIdentityIdResult}
 */
export function verifyTokenBalanceForIdentityId(proof, token_id, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenBalanceForIdentityId(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenBalanceForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenContractInfoResult}
 */
export function verifyTokenContractInfo(proof, token_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenContractInfo(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenContractInfoResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenDirectSellingPriceResult}
 */
export function verifyTokenDirectSellingPrice(proof, token_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenDirectSellingPrice(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenDirectSellingPriceResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {Uint8Array} identity_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenInfoForIdentityIdResult}
 */
export function verifyTokenInfoForIdentityId(proof, token_id, identity_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenInfoForIdentityId(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), addBorrowedObject(identity_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenInfoForIdentityIdResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {Uint8Array} identity_id
 * @param {any} distribution_type_js
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenPerpetualDistributionLastPaidTimeResult}
 */
export function verifyTokenPerpetualDistributionLastPaidTime(proof, token_id, identity_id, distribution_type_js, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenPerpetualDistributionLastPaidTime(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), addBorrowedObject(identity_id), addBorrowedObject(distribution_type_js), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenPerpetualDistributionLastPaidTimeResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenStatusResult}
 */
export function verifyTokenStatus(proof, token_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenStatus(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenStatusResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} token_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResult}
 */
export function verifyTokenTotalSupplyAndAggregatedIdentityBalance(proof, token_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTokenTotalSupplyAndAggregatedIdentityBalance(retptr, addBorrowedObject(proof), addBorrowedObject(token_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify action signers and return as an array of [signer_id, power] pairs
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {number} action_status
 * @param {Uint8Array} action_id
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyActionSignersResult}
 */
export function verifyActionSignersVec(proof, contract_id, group_contract_position, action_status, action_id, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyActionSignersVec(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), group_contract_position, action_status, addBorrowedObject(action_id), is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyActionSignersResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify action signers and return as a map with signer_id as key
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {number} action_status
 * @param {Uint8Array} action_id
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyActionSignersResult}
 */
export function verifyActionSignersMap(proof, contract_id, group_contract_position, action_status, action_id, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyActionSignersMap(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), group_contract_position, action_status, addBorrowedObject(action_id), is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyActionSignersResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify action infos in contract and return as an array of [action_id, action] pairs
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {number} action_status
 * @param {Uint8Array | null | undefined} start_action_id
 * @param {boolean | null | undefined} start_at_included
 * @param {number | null | undefined} limit
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyActionInfosInContractResult}
 */
export function verifyActionInfosInContractVec(proof, contract_id, group_contract_position, action_status, start_action_id, start_at_included, limit, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyActionInfosInContractVec(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), group_contract_position, action_status, isLikeNone(start_action_id) ? 0 : addHeapObject(start_action_id), isLikeNone(start_at_included) ? 0xFFFFFF : start_at_included ? 1 : 0, isLikeNone(limit) ? 0xFFFFFF : limit, is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyActionInfosInContractResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify action infos in contract and return as a map with action_id as key
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {number} action_status
 * @param {Uint8Array | null | undefined} start_action_id
 * @param {boolean | null | undefined} start_at_included
 * @param {number | null | undefined} limit
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyActionInfosInContractResult}
 */
export function verifyActionInfosInContractMap(proof, contract_id, group_contract_position, action_status, start_action_id, start_at_included, limit, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyActionInfosInContractMap(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), group_contract_position, action_status, isLikeNone(start_action_id) ? 0 : addHeapObject(start_action_id), isLikeNone(start_at_included) ? 0xFFFFFF : start_at_included ? 1 : 0, isLikeNone(limit) ? 0xFFFFFF : limit, is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyActionInfosInContractResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify group infos in contract and return as an array of [position, group] pairs
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number | null | undefined} start_group_contract_position
 * @param {boolean | null | undefined} start_at_included
 * @param {number | null | undefined} limit
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyGroupInfosInContractResult}
 */
export function verifyGroupInfosInContractVec(proof, contract_id, start_group_contract_position, start_at_included, limit, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyGroupInfosInContractVec(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), isLikeNone(start_group_contract_position) ? 0xFFFFFF : start_group_contract_position, isLikeNone(start_at_included) ? 0xFFFFFF : start_at_included ? 1 : 0, isLikeNone(limit) ? 0xFFFFFF : limit, is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyGroupInfosInContractResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verify group infos in contract and return as a map with position as key
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number | null | undefined} start_group_contract_position
 * @param {boolean | null | undefined} start_at_included
 * @param {number | null | undefined} limit
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyGroupInfosInContractResult}
 */
export function verifyGroupInfosInContractMap(proof, contract_id, start_group_contract_position, start_at_included, limit, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyGroupInfosInContractMap(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), isLikeNone(start_group_contract_position) ? 0xFFFFFF : start_group_contract_position, isLikeNone(start_at_included) ? 0xFFFFFF : start_at_included ? 1 : 0, isLikeNone(limit) ? 0xFFFFFF : limit, is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyGroupInfosInContractResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {number | null | undefined} action_status
 * @param {Uint8Array} action_id
 * @param {Uint8Array} action_signer_id
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyActionSignersTotalPowerResult}
 */
export function verifyActionSignersTotalPower(proof, contract_id, group_contract_position, action_status, action_id, action_signer_id, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyActionSignersTotalPower(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), group_contract_position, isLikeNone(action_status) ? 0xFFFFFF : action_status, addBorrowedObject(action_id), addBorrowedObject(action_signer_id), is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyActionSignersTotalPowerResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {boolean} is_proof_subset
 * @param {number} platform_version_number
 * @returns {VerifyGroupInfoResult}
 */
export function verifyGroupInfo(proof, contract_id, group_contract_position, is_proof_subset, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyGroupInfo(retptr, addBorrowedObject(proof), addBorrowedObject(contract_id), group_contract_position, is_proof_subset, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyGroupInfoResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} query_cbor
 * @param {any} contract_lookup
 * @param {number} platform_version_number
 * @returns {VerifyIdentityVotesGivenProofResult}
 */
export function verifyIdentityVotesGivenProofVec(proof, query_cbor, contract_lookup, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityVotesGivenProofVec(retptr, addBorrowedObject(proof), addBorrowedObject(query_cbor), addBorrowedObject(contract_lookup), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityVotesGivenProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} query_cbor
 * @param {any} contract_lookup
 * @param {number} platform_version_number
 * @returns {VerifyIdentityVotesGivenProofResult}
 */
export function verifyIdentityVotesGivenProofMap(proof, query_cbor, contract_lookup, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyIdentityVotesGivenProofMap(retptr, addBorrowedObject(proof), addBorrowedObject(query_cbor), addBorrowedObject(contract_lookup), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyIdentityVotesGivenProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} query_cbor
 * @param {number} platform_version_number
 * @returns {VerifyVotePollsEndDateQueryResult}
 */
export function verifyVotePollsEndDateQueryVec(proof, query_cbor, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyVotePollsEndDateQueryVec(retptr, addBorrowedObject(proof), addBorrowedObject(query_cbor), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyVotePollsEndDateQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} query_cbor
 * @param {number} platform_version_number
 * @returns {VerifyVotePollsEndDateQueryResult}
 */
export function verifyVotePollsEndDateQueryMap(proof, query_cbor, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyVotePollsEndDateQueryMap(retptr, addBorrowedObject(proof), addBorrowedObject(query_cbor), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyVotePollsEndDateQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_cbor
 * @param {string} document_type_name
 * @param {string} index_name
 * @param {Uint8Array | null | undefined} start_at_value
 * @param {Array<any> | null | undefined} start_index_values
 * @param {Array<any> | null | undefined} end_index_values
 * @param {number | null | undefined} limit
 * @param {boolean} order_ascending
 * @param {number} platform_version_number
 * @returns {VerifyContestsProofResult}
 */
export function verifyContestsProof(proof, contract_cbor, document_type_name, index_name, start_at_value, start_index_values, end_index_values, limit, order_ascending, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(index_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.verifyContestsProof(retptr, addBorrowedObject(proof), addBorrowedObject(contract_cbor), ptr0, len0, ptr1, len1, isLikeNone(start_at_value) ? 0 : addHeapObject(start_at_value), isLikeNone(start_index_values) ? 0 : addHeapObject(start_index_values), isLikeNone(end_index_values) ? 0 : addHeapObject(end_index_values), isLikeNone(limit) ? 0xFFFFFF : limit, order_ascending, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyContestsProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} masternode_pro_tx_hash
 * @param {Uint8Array} vote_cbor
 * @param {Uint8Array} data_contract_cbor
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifyMasternodeVoteResult}
 */
export function verifyMasternodeVote(proof, masternode_pro_tx_hash, vote_cbor, data_contract_cbor, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyMasternodeVote(retptr, addBorrowedObject(proof), addBorrowedObject(masternode_pro_tx_hash), addBorrowedObject(vote_cbor), addBorrowedObject(data_contract_cbor), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyMasternodeVoteResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} specialized_balance_id
 * @param {boolean} verify_subset_of_proof
 * @param {number} platform_version_number
 * @returns {VerifySpecializedBalanceResult}
 */
export function verifySpecializedBalance(proof, specialized_balance_id, verify_subset_of_proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifySpecializedBalance(retptr, addBorrowedObject(proof), addBorrowedObject(specialized_balance_id), verify_subset_of_proof, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifySpecializedBalanceResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_cbor
 * @param {string} document_type_name
 * @param {string} index_name
 * @param {Uint8Array} contested_document_resource_vote_poll_bytes
 * @param {string} result_type
 * @param {boolean} allow_include_locked_and_abstaining_vote_tally
 * @param {number} platform_version_number
 * @returns {VerifyVotePollVoteStateProofResult}
 */
export function verifyVotePollVoteStateProof(proof, contract_cbor, document_type_name, index_name, contested_document_resource_vote_poll_bytes, result_type, allow_include_locked_and_abstaining_vote_tally, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(index_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(result_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len2 = WASM_VECTOR_LEN;
        wasm.verifyVotePollVoteStateProof(retptr, addBorrowedObject(proof), addBorrowedObject(contract_cbor), ptr0, len0, ptr1, len1, addBorrowedObject(contested_document_resource_vote_poll_bytes), ptr2, len2, allow_include_locked_and_abstaining_vote_tally, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyVotePollVoteStateProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array} contract_cbor
 * @param {string} document_type_name
 * @param {string} index_name
 * @param {Uint8Array} contestant_id
 * @param {Uint8Array} contested_document_resource_vote_poll_bytes
 * @param {Uint8Array | null | undefined} start_at
 * @param {number | null | undefined} limit
 * @param {boolean} order_ascending
 * @param {number} platform_version_number
 * @returns {VerifyVotePollVotesProofResult}
 */
export function verifyVotePollVotesProof(proof, contract_cbor, document_type_name, index_name, contestant_id, contested_document_resource_vote_poll_bytes, start_at, limit, order_ascending, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(index_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        wasm.verifyVotePollVotesProof(retptr, addBorrowedObject(proof), addBorrowedObject(contract_cbor), ptr0, len0, ptr1, len1, addBorrowedObject(contestant_id), addBorrowedObject(contested_document_resource_vote_poll_bytes), isLikeNone(start_at) ? 0 : addHeapObject(start_at), isLikeNone(limit) ? 0xFFFFFF : limit, order_ascending, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyVotePollVotesProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * Verifies elements at a specific path with given keys
 *
 * **Note**: This function is currently not fully implemented due to limitations in the
 * WASM environment. The Element type from grovedb is not exposed through the verify
 * feature, making it impossible to properly serialize and return element data.
 *
 * For document verification, please use the document-specific verification functions
 * such as `verify_proof_keep_serialized` which are designed to work within these
 * limitations.
 *
 * # Alternative Approaches:
 *
 * 1. For document queries: Use `DriveDocumentQuery.verify_proof_keep_serialized()`
 * 2. For identity queries: Use the identity-specific verification functions
 * 3. For contract queries: Use `verify_contract()`
 *
 * This limitation exists because:
 * - The Element enum from grovedb contains references to internal tree structures
 * - These structures cannot be safely exposed across the WASM boundary
 * - The verify feature intentionally excludes server-side types for security
 * @param {Uint8Array} _proof
 * @param {Array<any>} _path
 * @param {Array<any>} _keys
 * @param {number} _platform_version_number
 * @returns {VerifyElementsResult}
 */
export function verifyElements(_proof, _path, _keys, _platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyElements(retptr, addBorrowedObject(_proof), addBorrowedObject(_path), addBorrowedObject(_keys), _platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyElementsResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} current_epoch
 * @param {number | null | undefined} start_epoch
 * @param {number} count
 * @param {boolean} ascending
 * @param {number} platform_version_number
 * @returns {VerifyEpochInfosResult}
 */
export function verifyEpochInfos(proof, current_epoch, start_epoch, count, ascending, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyEpochInfos(retptr, addBorrowedObject(proof), current_epoch, isLikeNone(start_epoch) ? 0xFFFFFF : start_epoch, count, ascending, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyEpochInfosResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} epoch_index
 * @param {number | null | undefined} limit
 * @param {Uint8Array | null | undefined} start_at_proposer_id
 * @param {boolean | null | undefined} start_at_included
 * @param {number} platform_version_number
 * @returns {VerifyEpochProposersResult}
 */
export function verifyEpochProposersByRangeVec(proof, epoch_index, limit, start_at_proposer_id, start_at_included, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyEpochProposersByRangeVec(retptr, addBorrowedObject(proof), epoch_index, isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(start_at_proposer_id) ? 0 : addHeapObject(start_at_proposer_id), isLikeNone(start_at_included) ? 0xFFFFFF : start_at_included ? 1 : 0, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyEpochProposersResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} epoch_index
 * @param {number | null | undefined} limit
 * @param {Uint8Array | null | undefined} start_at_proposer_id
 * @param {boolean | null | undefined} start_at_included
 * @param {number} platform_version_number
 * @returns {VerifyEpochProposersResult}
 */
export function verifyEpochProposersByRangeMap(proof, epoch_index, limit, start_at_proposer_id, start_at_included, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyEpochProposersByRangeMap(retptr, addBorrowedObject(proof), epoch_index, isLikeNone(limit) ? 0xFFFFFF : limit, isLikeNone(start_at_proposer_id) ? 0 : addHeapObject(start_at_proposer_id), isLikeNone(start_at_included) ? 0xFFFFFF : start_at_included ? 1 : 0, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyEpochProposersResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} epoch_index
 * @param {any} proposer_ids
 * @param {number} platform_version_number
 * @returns {VerifyEpochProposersResult}
 */
export function verifyEpochProposersByIdsVec(proof, epoch_index, proposer_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyEpochProposersByIdsVec(retptr, addBorrowedObject(proof), epoch_index, addBorrowedObject(proposer_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyEpochProposersResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} epoch_index
 * @param {any} proposer_ids
 * @param {number} platform_version_number
 * @returns {VerifyEpochProposersResult}
 */
export function verifyEpochProposersByIdsMap(proof, epoch_index, proposer_ids, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyEpochProposersByIdsMap(retptr, addBorrowedObject(proof), epoch_index, addBorrowedObject(proposer_ids), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyEpochProposersResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} core_subsidy_halving_interval
 * @param {number} activation_core_height
 * @param {number} current_core_height
 * @param {number} platform_version_number
 * @returns {VerifyTotalCreditsInSystemResult}
 */
export function verifyTotalCreditsInSystem(proof, core_subsidy_halving_interval, activation_core_height, current_core_height, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyTotalCreditsInSystem(retptr, addBorrowedObject(proof), core_subsidy_halving_interval, activation_core_height, current_core_height, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyTotalCreditsInSystemResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {number} platform_version_number
 * @returns {VerifyUpgradeStateResult}
 */
export function verifyUpgradeState(proof, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyUpgradeState(retptr, addBorrowedObject(proof), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyUpgradeStateResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} proof
 * @param {Uint8Array | null | undefined} start_protx_hash
 * @param {number} count
 * @param {number} platform_version_number
 * @returns {VerifyUpgradeVoteStatusResult}
 */
export function verifyUpgradeVoteStatus(proof, start_protx_hash, count, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyUpgradeVoteStatus(retptr, addBorrowedObject(proof), isLikeNone(start_protx_hash) ? 0 : addHeapObject(start_protx_hash), count, platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyUpgradeVoteStatusResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {any} token_transition_js
 * @param {any} contract_js
 * @param {Uint8Array} owner_id
 * @param {number} platform_version_number
 * @returns {TokenTransitionPathQueryResult}
 */
export function tokenTransitionIntoPathQuery(token_transition_js, contract_js, owner_id, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tokenTransitionIntoPathQuery(retptr, addBorrowedObject(token_transition_js), addBorrowedObject(contract_js), addBorrowedObject(owner_id), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return TokenTransitionPathQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} token_id
 * @param {Uint8Array} identity_id
 * @returns {TokenTransitionPathQueryResult}
 */
export function tokenBalanceForIdentityIdQuery(token_id, identity_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tokenBalanceForIdentityIdQuery(retptr, addBorrowedObject(token_id), addBorrowedObject(identity_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return TokenTransitionPathQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} token_id
 * @param {any} identity_ids_js
 * @returns {TokenTransitionPathQueryResult}
 */
export function tokenBalancesForIdentityIdsQuery(token_id, identity_ids_js) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tokenBalancesForIdentityIdsQuery(retptr, addBorrowedObject(token_id), addBorrowedObject(identity_ids_js));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return TokenTransitionPathQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} token_id
 * @param {Uint8Array} identity_id
 * @returns {TokenTransitionPathQueryResult}
 */
export function tokenInfoForIdentityIdQuery(token_id, identity_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tokenInfoForIdentityIdQuery(retptr, addBorrowedObject(token_id), addBorrowedObject(identity_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return TokenTransitionPathQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} token_id
 * @returns {TokenTransitionPathQueryResult}
 */
export function tokenDirectPurchasePriceQuery(token_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.tokenDirectPurchasePriceQuery(retptr, addBorrowedObject(token_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return TokenTransitionPathQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {Uint8Array} contract_id
 * @param {number} group_contract_position
 * @param {Uint8Array} action_id
 * @param {Uint8Array} identity_id
 * @returns {TokenTransitionPathQueryResult}
 */
export function groupActiveAndClosedActionSingleSignerQuery(contract_id, group_contract_position, action_id, identity_id) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.groupActiveAndClosedActionSingleSignerQuery(retptr, addBorrowedObject(contract_id), group_contract_position, addBorrowedObject(action_id), addBorrowedObject(identity_id));
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return TokenTransitionPathQueryResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

/**
 * @param {any} state_transition_js
 * @param {bigint} block_height
 * @param {bigint} block_time_ms
 * @param {number} block_core_height
 * @param {Uint8Array} proof
 * @param {any} known_contracts_js
 * @param {number} platform_version_number
 * @returns {VerifyStateTransitionWasExecutedWithProofResult}
 */
export function verifyStateTransitionWasExecutedWithProof(state_transition_js, block_height, block_time_ms, block_core_height, proof, known_contracts_js, platform_version_number) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.verifyStateTransitionWasExecutedWithProof(retptr, addBorrowedObject(state_transition_js), block_height, block_time_ms, block_core_height, addBorrowedObject(proof), addBorrowedObject(known_contracts_js), platform_version_number);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
        if (r2) {
            throw takeObject(r1);
        }
        return VerifyStateTransitionWasExecutedWithProofResult.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

export function main() {
    wasm.main();
}

function __wbg_adapter_62(arg0, arg1, arg2) {
    wasm.__wbindgen_export_5(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_69(arg0, arg1) {
    wasm.__wbindgen_export_6(arg0, arg1);
}

function __wbg_adapter_72(arg0, arg1) {
    wasm.__wbindgen_export_7(arg0, arg1);
}

function __wbg_adapter_870(arg0, arg1, arg2, arg3) {
    wasm.__wbindgen_export_8(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
 * Balance type for specialized purposes
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const BalanceType = Object.freeze({
    Voting: 0, "0": "Voting",
    Staking: 1, "1": "Staking",
    Reserved: 2, "2": "Reserved",
    Escrow: 3, "3": "Escrow",
    Reward: 4, "4": "Reward",
    Custom: 5, "5": "Custom",
});
/**
 * Error categories for better error handling in JavaScript
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
 */
export const ErrorCategory = Object.freeze({
    /**
     * Network-related errors (connection, timeout, etc.)
     */
    Network: 0, "0": "Network",
    /**
     * Serialization/deserialization errors
     */
    Serialization: 1, "1": "Serialization",
    /**
     * Validation errors (invalid input, etc.)
     */
    Validation: 2, "2": "Validation",
    /**
     * Platform errors (from Dash Platform)
     */
    Platform: 3, "3": "Platform",
    /**
     * Proof verification errors
     */
    ProofVerification: 4, "4": "ProofVerification",
    /**
     * State transition errors
     */
    StateTransition: 5, "5": "StateTransition",
    /**
     * Identity-related errors
     */
    Identity: 6, "6": "Identity",
    /**
     * Document-related errors
     */
    Document: 7, "7": "Document",
    /**
     * Contract-related errors
     */
    Contract: 8, "8": "Contract",
    /**
     * Unknown or uncategorized errors
     */
    Unknown: 9, "9": "Unknown",
});
/**
 * Group action types for JavaScript
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}
 */
export const GroupActionType = Object.freeze({
    TokenTransfer: 0, "0": "TokenTransfer",
    TokenMint: 1, "1": "TokenMint",
    TokenBurn: 2, "2": "TokenBurn",
    TokenFreeze: 3, "3": "TokenFreeze",
    TokenUnfreeze: 4, "4": "TokenUnfreeze",
    TokenSetPrice: 5, "5": "TokenSetPrice",
    ContractUpdate: 6, "6": "ContractUpdate",
    GroupMemberAdd: 7, "7": "GroupMemberAdd",
    GroupMemberRemove: 8, "8": "GroupMemberRemove",
    GroupSettingsUpdate: 9, "9": "GroupSettingsUpdate",
    Custom: 10, "10": "Custom",
});
/**
 * Group types
 * @enum {0 | 1 | 2 | 3}
 */
export const GroupType = Object.freeze({
    Multisig: 0, "0": "Multisig",
    DAO: 1, "1": "DAO",
    Committee: 2, "2": "Committee",
    Custom: 3, "3": "Custom",
});
/**
 * Group member role
 * @enum {0 | 1 | 2 | 3}
 */
export const MemberRole = Object.freeze({
    Owner: 0, "0": "Owner",
    Admin: 1, "1": "Admin",
    Member: 2, "2": "Member",
    Observer: 3, "3": "Observer",
});
/**
 * BIP39 mnemonic strength
 * @enum {128 | 160 | 192 | 224 | 256}
 */
export const MnemonicStrength = Object.freeze({
    /**
     * 12 words (128 bits)
     */
    Words12: 128, "128": "Words12",
    /**
     * 15 words (160 bits)
     */
    Words15: 160, "160": "Words15",
    /**
     * 18 words (192 bits)
     */
    Words18: 192, "192": "Words18",
    /**
     * 21 words (224 bits)
     */
    Words21: 224, "224": "Words21",
    /**
     * 24 words (256 bits)
     */
    Words24: 256, "256": "Words24",
});
/**
 * State transition type enum for JavaScript
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}
 */
export const StateTransitionTypeWasm = Object.freeze({
    DataContractCreate: 0, "0": "DataContractCreate",
    Batch: 1, "1": "Batch",
    IdentityCreate: 2, "2": "IdentityCreate",
    IdentityTopUp: 3, "3": "IdentityTopUp",
    DataContractUpdate: 4, "4": "DataContractUpdate",
    IdentityUpdate: 5, "5": "IdentityUpdate",
    IdentityCreditWithdrawal: 6, "6": "IdentityCreditWithdrawal",
    IdentityCreditTransfer: 7, "7": "IdentityCreditTransfer",
    MasternodeVote: 8, "8": "MasternodeVote",
});
/**
 * Vote types
 * @enum {0 | 1 | 2}
 */
export const VoteType = Object.freeze({
    Yes: 0, "0": "Yes",
    No: 1, "1": "No",
    Abstain: 2, "2": "Abstain",
});
/**
 * BIP39 word list languages
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}
 */
export const WordListLanguage = Object.freeze({
    English: 0, "0": "English",
    Japanese: 1, "1": "Japanese",
    Korean: 2, "2": "Korean",
    Spanish: 3, "3": "Spanish",
    ChineseSimplified: 4, "4": "ChineseSimplified",
    ChineseTraditional: 5, "5": "ChineseTraditional",
    French: 6, "6": "French",
    Italian: 7, "7": "Italian",
    Czech: 8, "8": "Czech",
    Portuguese: 9, "9": "Portuguese",
});

const AssetLockProofFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_assetlockproof_free(ptr >>> 0, 1));
/**
 * Asset lock proof wrapper for WASM
 */
export class AssetLockProof {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(AssetLockProof.prototype);
        obj.__wbg_ptr = ptr;
        AssetLockProofFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AssetLockProofFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_assetlockproof_free(ptr, 0);
    }
    /**
     * Create an instant asset lock proof
     * @param {Uint8Array} transaction_bytes
     * @param {number} output_index
     * @param {Uint8Array} instant_lock_bytes
     * @returns {AssetLockProof}
     */
    static createInstant(transaction_bytes, output_index, instant_lock_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(transaction_bytes, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passArray8ToWasm0(instant_lock_bytes, wasm.__wbindgen_export_0);
            const len1 = WASM_VECTOR_LEN;
            wasm.assetlockproof_createInstant(retptr, ptr0, len0, output_index, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return AssetLockProof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a chain asset lock proof
     * @param {number} core_chain_locked_height
     * @param {Uint8Array} out_point_bytes
     * @returns {AssetLockProof}
     */
    static createChain(core_chain_locked_height, out_point_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(out_point_bytes, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.assetlockproof_createChain(retptr, core_chain_locked_height, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return AssetLockProof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the proof type
     * @returns {string}
     */
    get proofType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_proofType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the transaction (only for instant proofs)
     * @returns {Uint8Array}
     */
    get transaction() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_transaction(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the output index
     * @returns {number}
     */
    get outputIndex() {
        const ret = wasm.assetlockproof_outputIndex(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the instant lock (if present)
     * @returns {Uint8Array | undefined}
     */
    get instantLock() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_instantLock(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the core chain locked height (only for chain proofs)
     * @returns {number | undefined}
     */
    get coreChainLockedHeight() {
        const ret = wasm.assetlockproof_coreChainLockedHeight(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * Get the outpoint (as bytes)
     * @returns {Uint8Array | undefined}
     */
    get outPoint() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_outPoint(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Serialize to bytes using bincode
     * @returns {Uint8Array}
     */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_toBytes(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Deserialize from bytes using bincode
     * @param {Uint8Array} bytes
     * @returns {AssetLockProof}
     */
    static fromBytes(bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.assetlockproof_fromBytes(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return AssetLockProof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Serialize to JSON-compatible object
     * @returns {any}
     */
    toJSON() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_toJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Deserialize from JSON-compatible object
     * @param {any} json
     * @returns {AssetLockProof}
     */
    static fromJSON(json) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_fromJSON(retptr, addHeapObject(json));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return AssetLockProof.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get identity identifier created from this proof
     * @returns {string}
     */
    getIdentityId() {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.assetlockproof_getIdentityId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
}

const BalanceAllocationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_balanceallocation_free(ptr >>> 0, 1));
/**
 * Specialized balance allocation
 */
export class BalanceAllocation {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BalanceAllocationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_balanceallocation_free(ptr, 0);
    }
    /**
     * Get identity ID
     * @returns {string}
     */
    get identityId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balanceallocation_identityId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get balance type
     * @returns {string}
     */
    get balanceType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balanceallocation_balanceType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get allocated amount
     * @returns {bigint}
     */
    get allocatedAmount() {
        const ret = wasm.balanceallocation_allocatedAmount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get used amount
     * @returns {bigint}
     */
    get usedAmount() {
        const ret = wasm.balanceallocation_usedAmount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get available amount
     * @returns {bigint}
     */
    getAvailableAmount() {
        const ret = wasm.balanceallocation_getAvailableAmount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get allocation timestamp
     * @returns {bigint}
     */
    get allocatedAt() {
        const ret = wasm.balanceallocation_allocatedAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get expiration timestamp
     * @returns {bigint | undefined}
     */
    get expiresAt() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balanceallocation_expiresAt(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Check if expired
     * @returns {boolean}
     */
    isExpired() {
        const ret = wasm.balanceallocation_isExpired(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.balanceallocation_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const BatchOptimizerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_batchoptimizer_free(ptr >>> 0, 1));
/**
 * Batch operations optimizer
 */
export class BatchOptimizer {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BatchOptimizerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_batchoptimizer_free(ptr, 0);
    }
    /**
     * Create a new batch optimizer
     */
    constructor() {
        const ret = wasm.batchoptimizer_new();
        this.__wbg_ptr = ret >>> 0;
        BatchOptimizerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set batch size
     * @param {number} size
     */
    setBatchSize(size) {
        wasm.batchoptimizer_setBatchSize(this.__wbg_ptr, size);
    }
    /**
     * Set max concurrent operations
     * @param {number} max
     */
    setMaxConcurrent(max) {
        wasm.batchoptimizer_setMaxConcurrent(this.__wbg_ptr, max);
    }
    /**
     * Get optimal batch count for a given total
     * @param {number} total_items
     * @returns {number}
     */
    getOptimalBatchCount(total_items) {
        const ret = wasm.batchoptimizer_getOptimalBatchCount(this.__wbg_ptr, total_items);
        return ret >>> 0;
    }
    /**
     * Get batch boundaries
     * @param {number} total_items
     * @param {number} batch_index
     * @returns {object}
     */
    getBatchBoundaries(total_items, batch_index) {
        const ret = wasm.batchoptimizer_getBatchBoundaries(this.__wbg_ptr, total_items, batch_index);
        return takeObject(ret);
    }
}

const BroadcastOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_broadcastoptions_free(ptr >>> 0, 1));
/**
 * Broadcast options
 */
export class BroadcastOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BroadcastOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_broadcastoptions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.broadcastoptions_new();
        this.__wbg_ptr = ret >>> 0;
        BroadcastOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean} wait
     */
    setWaitForConfirmation(wait) {
        wasm.broadcastoptions_setWaitForConfirmation(this.__wbg_ptr, wait);
    }
    /**
     * @param {number} count
     */
    setRetryCount(count) {
        wasm.broadcastoptions_setRetryCount(this.__wbg_ptr, count);
    }
    /**
     * @param {number} timeout
     */
    setTimeoutMs(timeout) {
        wasm.broadcastoptions_setTimeoutMs(this.__wbg_ptr, timeout);
    }
    /**
     * @returns {boolean}
     */
    get waitForConfirmation() {
        const ret = wasm.broadcastoptions_waitForConfirmation(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get retryCount() {
        const ret = wasm.broadcastoptions_retryCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get timeoutMs() {
        const ret = wasm.broadcastoptions_timeoutMs(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const BroadcastResponseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_broadcastresponse_free(ptr >>> 0, 1));
/**
 * Response from broadcasting a state transition
 */
export class BroadcastResponse {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BroadcastResponse.prototype);
        obj.__wbg_ptr = ptr;
        BroadcastResponseFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BroadcastResponseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_broadcastresponse_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get success() {
        const ret = wasm.broadcastresponse_success(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {string | undefined}
     */
    get transactionId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.broadcastresponse_transactionId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get blockHeight() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.broadcastresponse_blockHeight(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get error() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.broadcastresponse_error(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.broadcastresponse_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const BrowserSignerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_browsersigner_free(ptr >>> 0, 1));
/**
 * Browser-based signer that uses Web Crypto API
 */
export class BrowserSigner {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BrowserSignerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_browsersigner_free(ptr, 0);
    }
    /**
     * Create a new browser signer
     */
    constructor() {
        const ret = wasm.browsersigner_new();
        this.__wbg_ptr = ret >>> 0;
        BrowserSignerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Generate a new key pair
     * @param {string} key_type
     * @param {number} public_key_id
     * @returns {Promise<any>}
     */
    generateKeyPair(key_type, public_key_id) {
        const ptr0 = passStringToWasm0(key_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.browsersigner_generateKeyPair(this.__wbg_ptr, ptr0, len0, public_key_id);
        return takeObject(ret);
    }
    /**
     * Sign data with a stored key
     * @param {Uint8Array} data
     * @param {number} public_key_id
     * @returns {Promise<Uint8Array>}
     */
    signWithStoredKey(data, public_key_id) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.browsersigner_signWithStoredKey(this.__wbg_ptr, ptr0, len0, public_key_id);
        return takeObject(ret);
    }
}

const CompressionUtilsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_compressionutils_free(ptr >>> 0, 1));
/**
 * Compression utilities for large data
 */
export class CompressionUtils {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CompressionUtilsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compressionutils_free(ptr, 0);
    }
    /**
     * Check if data should be compressed based on size
     * @param {number} data_size
     * @returns {boolean}
     */
    static shouldCompress(data_size) {
        const ret = wasm.compressionutils_shouldCompress(data_size);
        return ret !== 0;
    }
    /**
     * Estimate compression ratio
     * @param {Uint8Array} data
     * @returns {number}
     */
    static estimateCompressionRatio(data) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.compressionutils_estimateCompressionRatio(ptr0, len0);
        return ret;
    }
}

const ContestedResourceQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contestedresourcequery_free(ptr >>> 0, 1));
/**
 * Query for contested resources (voting)
 */
export class ContestedResourceQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContestedResourceQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contestedresourcequery_free(ptr, 0);
    }
    /**
     * @param {string} contract_id
     * @param {string} document_type
     * @param {string} index_name
     */
    constructor(contract_id, document_type, index_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(index_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len2 = WASM_VECTOR_LEN;
            wasm.contestedresourcequery_new(retptr, ptr0, len0, ptr1, len1, ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            ContestedResourceQueryFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} value
     */
    set setStartValue(value) {
        const ptr0 = passArray8ToWasm0(value, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.contestedresourcequery_set_setStartValue(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} included
     */
    set setStartIncluded(included) {
        wasm.contestedresourcequery_set_setStartIncluded(this.__wbg_ptr, included);
    }
    /**
     * @param {number} limit
     */
    set limit(limit) {
        wasm.contestedresourcequery_set_limit(this.__wbg_ptr, limit);
    }
}

const ContractCacheFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractcache_free(ptr >>> 0, 1));
/**
 * Advanced contract cache with LRU eviction and smart preloading
 */
export class ContractCache {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ContractCache.prototype);
        obj.__wbg_ptr = ptr;
        ContractCacheFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractCacheFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractcache_free(ptr, 0);
    }
    /**
     * @param {ContractCacheConfig | null} [config]
     */
    constructor(config) {
        let ptr0 = 0;
        if (!isLikeNone(config)) {
            _assertClass(config, ContractCacheConfig);
            ptr0 = config.__destroy_into_raw();
        }
        const ret = wasm.contractcache_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        ContractCacheFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Cache a contract
     * @param {Uint8Array} contract_bytes
     * @returns {string}
     */
    cacheContract(contract_bytes) {
        let deferred3_0;
        let deferred3_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(contract_bytes, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.contractcache_cacheContract(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr2 = r0;
            var len2 = r1;
            if (r3) {
                ptr2 = 0; len2 = 0;
                throw takeObject(r2);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Get a cached contract
     * @param {string} contract_id
     * @returns {Uint8Array | undefined}
     */
    getCachedContract(contract_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.contractcache_getCachedContract(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get contract metadata
     * @param {string} contract_id
     * @returns {any}
     */
    getContractMetadata(contract_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.contractcache_getContractMetadata(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Check if a contract is cached
     * @param {string} contract_id
     * @returns {boolean}
     */
    isContractCached(contract_id) {
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.contractcache_isContractCached(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
     * Get all cached contract IDs
     * @returns {Array<any>}
     */
    getCachedContractIds() {
        const ret = wasm.contractcache_getCachedContractIds(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Get cache statistics
     * @returns {any}
     */
    getCacheStats() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contractcache_getCacheStats(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Clear the cache
     */
    clearCache() {
        wasm.contractcache_clearCache(this.__wbg_ptr);
    }
    /**
     * Remove expired entries
     * @returns {number}
     */
    cleanupExpired() {
        const ret = wasm.contractcache_cleanupExpired(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Preload contracts based on access patterns
     * @returns {Array<any>}
     */
    getPreloadSuggestions() {
        const ret = wasm.contractcache_getPreloadSuggestions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const ContractCacheConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractcacheconfig_free(ptr >>> 0, 1));
/**
 * Contract cache configuration
 */
export class ContractCacheConfig {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractCacheConfigFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractcacheconfig_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.contractcacheconfig_new();
        this.__wbg_ptr = ret >>> 0;
        ContractCacheConfigFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} max
     */
    setMaxContracts(max) {
        wasm.contractcacheconfig_setMaxContracts(this.__wbg_ptr, max);
    }
    /**
     * @param {number} ttl_ms
     */
    setTtl(ttl_ms) {
        wasm.contractcacheconfig_setTtl(this.__wbg_ptr, ttl_ms);
    }
    /**
     * @param {boolean} enable
     */
    setCacheHistory(enable) {
        wasm.contractcacheconfig_setCacheHistory(this.__wbg_ptr, enable);
    }
    /**
     * @param {number} max
     */
    setMaxVersionsPerContract(max) {
        wasm.contractcacheconfig_setMaxVersionsPerContract(this.__wbg_ptr, max);
    }
    /**
     * @param {boolean} enable
     */
    setEnablePreloading(enable) {
        wasm.contractcacheconfig_setEnablePreloading(this.__wbg_ptr, enable);
    }
}

const ContractHistoryEntryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contracthistoryentry_free(ptr >>> 0, 1));
/**
 * Contract history entry
 */
export class ContractHistoryEntry {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractHistoryEntryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contracthistoryentry_free(ptr, 0);
    }
    /**
     * Get contract ID
     * @returns {string}
     */
    get contractId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contracthistoryentry_contractId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get version
     * @returns {number}
     */
    get version() {
        const ret = wasm.contracthistoryentry_version(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get operation type
     * @returns {string}
     */
    get operation() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contracthistoryentry_operation(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get timestamp
     * @returns {bigint}
     */
    get timestamp() {
        const ret = wasm.contracthistoryentry_timestamp(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get changes list
     * @returns {Array<any>}
     */
    get changes() {
        const ret = wasm.contracthistoryentry_changes(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Get transaction hash
     * @returns {string | undefined}
     */
    get transactionHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contracthistoryentry_transactionHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contracthistoryentry_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const ContractVersionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_contractversion_free(ptr >>> 0, 1));
/**
 * Contract version information
 */
export class ContractVersion {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ContractVersionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_contractversion_free(ptr, 0);
    }
    /**
     * Get version number
     * @returns {number}
     */
    get version() {
        const ret = wasm.contractversion_version(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get schema hash
     * @returns {string}
     */
    get schemaHash() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contractversion_schemaHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get owner ID
     * @returns {string}
     */
    get ownerId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contractversion_ownerId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get creation timestamp
     * @returns {bigint}
     */
    get createdAt() {
        const ret = wasm.contractversion_createdAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get document types count
     * @returns {number}
     */
    get documentTypesCount() {
        const ret = wasm.contractversion_documentTypesCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get total documents created with this version
     * @returns {bigint}
     */
    get totalDocuments() {
        const ret = wasm.contractversion_totalDocuments(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.contractversion_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const DapiClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dapiclient_free(ptr >>> 0, 1));
/**
 * DAPI Client for making requests to Dash Platform
 */
export class DapiClient {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DapiClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dapiclient_free(ptr, 0);
    }
    /**
     * Create a new DAPI client
     * @param {DapiClientConfig} config
     */
    constructor(config) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(config, DapiClientConfig);
            var ptr0 = config.__destroy_into_raw();
            wasm.dapiclient_new(retptr, ptr0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            DapiClientFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the network type
     * @returns {string}
     */
    get network() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.dapiclient_network(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get current endpoint
     * @returns {string}
     */
    getCurrentEndpoint() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.dapiclient_getCurrentEndpoint(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Broadcast a state transition
     * @param {Uint8Array} state_transition_bytes
     * @param {boolean} wait
     * @returns {Promise<any>}
     */
    broadcastStateTransition(state_transition_bytes, wait) {
        const ptr0 = passArray8ToWasm0(state_transition_bytes, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dapiclient_broadcastStateTransition(this.__wbg_ptr, ptr0, len0, wait);
        return takeObject(ret);
    }
    /**
     * Get identity by ID
     * @param {string} identity_id
     * @param {boolean} prove
     * @returns {Promise<any>}
     */
    getIdentity(identity_id, prove) {
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dapiclient_getIdentity(this.__wbg_ptr, ptr0, len0, prove);
        return takeObject(ret);
    }
    /**
     * Get data contract by ID
     * @param {string} contract_id
     * @param {boolean} prove
     * @returns {Promise<any>}
     */
    getDataContract(contract_id, prove) {
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dapiclient_getDataContract(this.__wbg_ptr, ptr0, len0, prove);
        return takeObject(ret);
    }
    /**
     * Get documents
     * @param {string} contract_id
     * @param {string} document_type
     * @param {any} where_clause
     * @param {any} order_by
     * @param {number} limit
     * @param {string | null | undefined} start_after
     * @param {boolean} prove
     * @returns {Promise<any>}
     */
    getDocuments(contract_id, document_type, where_clause, order_by, limit, start_after, prove) {
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(start_after) ? 0 : passStringToWasm0(start_after, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.dapiclient_getDocuments(this.__wbg_ptr, ptr0, len0, ptr1, len1, addHeapObject(where_clause), addHeapObject(order_by), limit, ptr2, len2, prove);
        return takeObject(ret);
    }
    /**
     * Get epoch info
     * @param {number | null | undefined} epoch
     * @param {boolean} prove
     * @returns {Promise<any>}
     */
    getEpochInfo(epoch, prove) {
        const ret = wasm.dapiclient_getEpochInfo(this.__wbg_ptr, isLikeNone(epoch) ? 0x100000001 : (epoch) >>> 0, prove);
        return takeObject(ret);
    }
    /**
     * Subscribe to state transitions
     * @param {any} _query
     * @param {Function} _callback
     * @returns {Promise<any>}
     */
    subscribeToStateTransitions(_query, _callback) {
        const ret = wasm.dapiclient_subscribeToStateTransitions(this.__wbg_ptr, addHeapObject(_query), addHeapObject(_callback));
        return takeObject(ret);
    }
    /**
     * Get protocol version
     * @returns {Promise<any>}
     */
    getProtocolVersion() {
        const ret = wasm.dapiclient_getProtocolVersion(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Wait for state transition result
     * @param {string} state_transition_hash
     * @param {number | null} [timeout_ms]
     * @returns {Promise<any>}
     */
    waitForStateTransitionResult(state_transition_hash, timeout_ms) {
        const ptr0 = passStringToWasm0(state_transition_hash, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dapiclient_waitForStateTransitionResult(this.__wbg_ptr, ptr0, len0, isLikeNone(timeout_ms) ? 0x100000001 : (timeout_ms) >>> 0);
        return takeObject(ret);
    }
}

const DapiClientConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dapiclientconfig_free(ptr >>> 0, 1));
/**
 * DAPI Client configuration
 */
export class DapiClientConfig {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DapiClientConfigFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dapiclientconfig_free(ptr, 0);
    }
    /**
     * @param {string} network
     */
    constructor(network) {
        const ptr0 = passStringToWasm0(network, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dapiclientconfig_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        DapiClientConfigFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Add a custom endpoint
     * @param {string} endpoint
     */
    addEndpoint(endpoint) {
        const ptr0 = passStringToWasm0(endpoint, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.dapiclientconfig_addEndpoint(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Set timeout in milliseconds
     * @param {number} timeout_ms
     */
    setTimeout(timeout_ms) {
        wasm.dapiclientconfig_setTimeout(this.__wbg_ptr, timeout_ms);
    }
    /**
     * Set number of retries
     * @param {number} retries
     */
    setRetries(retries) {
        wasm.dapiclientconfig_setRetries(this.__wbg_ptr, retries);
    }
    /**
     * Get endpoints as JavaScript array
     * @returns {Array<any>}
     */
    get endpoints() {
        const ret = wasm.dapiclientconfig_endpoints(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const DataContractTransitionBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_datacontracttransitionbuilder_free(ptr >>> 0, 1));
/**
 * Builder for creating data contract transitions
 */
export class DataContractTransitionBuilder {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DataContractTransitionBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_datacontracttransitionbuilder_free(ptr, 0);
    }
    /**
     * @param {string} owner_id
     */
    constructor(owner_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(owner_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.datacontracttransitionbuilder_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            DataContractTransitionBuilderFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} contract_id
     */
    setContractId(contract_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.datacontracttransitionbuilder_setContractId(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} version
     */
    setVersion(version) {
        wasm.datacontracttransitionbuilder_setVersion(this.__wbg_ptr, version);
    }
    /**
     * @param {number} fee_increase
     */
    setUserFeeIncrease(fee_increase) {
        wasm.datacontracttransitionbuilder_setUserFeeIncrease(this.__wbg_ptr, fee_increase);
    }
    /**
     * @param {bigint} nonce
     */
    setIdentityNonce(nonce) {
        wasm.datacontracttransitionbuilder_setIdentityNonce(this.__wbg_ptr, nonce);
    }
    /**
     * @param {bigint} nonce
     */
    setIdentityContractNonce(nonce) {
        wasm.datacontracttransitionbuilder_setIdentityContractNonce(this.__wbg_ptr, nonce);
    }
    /**
     * @param {string} document_type
     * @param {any} schema
     */
    addDocumentSchema(document_type, schema) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.datacontracttransitionbuilder_addDocumentSchema(retptr, this.__wbg_ptr, ptr0, len0, addHeapObject(schema));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} definition
     */
    setContractDefinition(definition) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.datacontracttransitionbuilder_setContractDefinition(retptr, this.__wbg_ptr, addHeapObject(definition));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} signature_public_key_id
     * @returns {Uint8Array}
     */
    buildCreateTransition(signature_public_key_id) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.datacontracttransitionbuilder_buildCreateTransition(retptr, ptr, addHeapObject(signature_public_key_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} signature_public_key_id
     * @returns {Uint8Array}
     */
    buildUpdateTransition(signature_public_key_id) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.datacontracttransitionbuilder_buildUpdateTransition(retptr, ptr, addHeapObject(signature_public_key_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const DataContractWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_datacontractwasm_free(ptr >>> 0, 1));

export class DataContractWasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DataContractWasm.prototype);
        obj.__wbg_ptr = ptr;
        DataContractWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DataContractWasmFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_datacontractwasm_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.datacontractwasm_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get version() {
        const ret = wasm.datacontractwasm_version(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {string}
     */
    get ownerId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.datacontractwasm_ownerId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {any}
     */
    toJSON() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.datacontractwasm_toJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const DocumentBatchBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_documentbatchbuilder_free(ptr >>> 0, 1));
/**
 * Document transition builder for WASM
 *
 * This is a simplified builder that helps construct document batch transitions.
 */
export class DocumentBatchBuilder {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DocumentBatchBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_documentbatchbuilder_free(ptr, 0);
    }
    /**
     * @param {string} owner_id
     */
    constructor(owner_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(owner_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.documentbatchbuilder_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            DocumentBatchBuilderFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} fee_increase
     */
    setUserFeeIncrease(fee_increase) {
        wasm.documentbatchbuilder_setUserFeeIncrease(this.__wbg_ptr, fee_increase);
    }
    /**
     * @param {string} contract_id
     * @param {string} document_type
     * @param {any} data
     * @param {Uint8Array} entropy
     */
    addCreateDocument(contract_id, document_type, data, entropy) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passArray8ToWasm0(entropy, wasm.__wbindgen_export_0);
            const len2 = WASM_VECTOR_LEN;
            wasm.documentbatchbuilder_addCreateDocument(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, addHeapObject(data), ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} contract_id
     * @param {string} document_type
     * @param {string} document_id
     */
    addDeleteDocument(contract_id, document_type, document_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(document_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len2 = WASM_VECTOR_LEN;
            wasm.documentbatchbuilder_addDeleteDocument(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} contract_id
     * @param {string} document_type
     * @param {string} document_id
     * @param {number} revision
     * @param {any} data
     */
    addReplaceDocument(contract_id, document_type, document_id, revision, data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(document_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len2 = WASM_VECTOR_LEN;
            wasm.documentbatchbuilder_addReplaceDocument(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, revision, addHeapObject(data));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} signature_public_key_id
     * @returns {Uint8Array}
     */
    build(signature_public_key_id) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentbatchbuilder_build(retptr, ptr, addHeapObject(signature_public_key_id));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const DocumentQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_documentquery_free(ptr >>> 0, 1));
/**
 * Document query for searching documents
 */
export class DocumentQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DocumentQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_documentquery_free(ptr, 0);
    }
    /**
     * @param {string} contract_id
     * @param {string} document_type
     */
    constructor(contract_id, document_type) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            wasm.documentquery_new(retptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            DocumentQueryFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} field
     * @param {string} operator
     * @param {any} value
     */
    addWhereClause(field, operator, value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(field, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(operator, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            wasm.documentquery_addWhereClause(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, addHeapObject(value));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {string} field
     * @param {boolean} ascending
     */
    addOrderBy(field, ascending) {
        const ptr0 = passStringToWasm0(field, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.documentquery_addOrderBy(this.__wbg_ptr, ptr0, len0, ascending);
    }
    /**
     * @param {number} limit
     */
    set limit(limit) {
        wasm.documentquery_set_limit(this.__wbg_ptr, limit);
    }
    /**
     * @param {number} offset
     */
    set offset(offset) {
        wasm.documentquery_set_offset(this.__wbg_ptr, offset);
    }
    /**
     * @returns {string}
     */
    get contractId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentquery_contractId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get documentType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentquery_documentType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number | undefined}
     */
    get limit() {
        const ret = wasm.documentquery_limit(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get offset() {
        const ret = wasm.documentquery_offset(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * Get where clauses as JavaScript array
     * @returns {Array<any>}
     */
    getWhereClauses() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentquery_getWhereClauses(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get order by clauses as JavaScript array
     * @returns {Array<any>}
     */
    getOrderByClauses() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentquery_getOrderByClauses(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const DocumentQueryOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_documentqueryoptions_free(ptr >>> 0, 1));
/**
 * Document query options for fetching multiple documents
 */
export class DocumentQueryOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DocumentQueryOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_documentqueryoptions_free(ptr, 0);
    }
    /**
     * @param {string} contract_id
     * @param {string} document_type
     */
    constructor(contract_id, document_type) {
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.documentqueryoptions_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        DocumentQueryOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {any} where_clause
     */
    setWhereClause(where_clause) {
        wasm.documentqueryoptions_setWhereClause(this.__wbg_ptr, addHeapObject(where_clause));
    }
    /**
     * @param {any} order_by
     */
    setOrderBy(order_by) {
        wasm.documentqueryoptions_setOrderBy(this.__wbg_ptr, addHeapObject(order_by));
    }
    /**
     * @param {number} limit
     */
    setLimit(limit) {
        wasm.documentqueryoptions_setLimit(this.__wbg_ptr, limit);
    }
    /**
     * @param {string} start_at
     */
    setStartAt(start_at) {
        const ptr0 = passStringToWasm0(start_at, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.documentqueryoptions_setStartAt(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} start_after
     */
    setStartAfter(start_after) {
        const ptr0 = passStringToWasm0(start_after, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.documentqueryoptions_setStartAfter(this.__wbg_ptr, ptr0, len0);
    }
}

const DocumentVerificationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_documentverificationresult_free(ptr >>> 0, 1));
/**
 * Result of document verification
 */
export class DocumentVerificationResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DocumentVerificationResult.prototype);
        obj.__wbg_ptr = ptr;
        DocumentVerificationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DocumentVerificationResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_documentverificationresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get rootHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentverificationresult_rootHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get documentsJson() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentverificationresult_documentsJson(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}

const EpochFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_epoch_free(ptr >>> 0, 1));
/**
 * Represents an epoch in the Dash Platform
 */
export class Epoch {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Epoch.prototype);
        obj.__wbg_ptr = ptr;
        EpochFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EpochFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_epoch_free(ptr, 0);
    }
    /**
     * Get the epoch index
     * @returns {number}
     */
    get index() {
        const ret = wasm.epoch_index(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the start block height
     * @returns {bigint}
     */
    get startBlockHeight() {
        const ret = wasm.epoch_startBlockHeight(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get the start block core height
     * @returns {number}
     */
    get startBlockCoreHeight() {
        const ret = wasm.epoch_startBlockCoreHeight(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the start time in milliseconds
     * @returns {bigint}
     */
    get startTimeMs() {
        const ret = wasm.epoch_startTimeMs(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get the fee multiplier for this epoch
     * @returns {number}
     */
    get feeMultiplier() {
        const ret = wasm.epoch_feeMultiplier(this.__wbg_ptr);
        return ret;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.epoch_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const EpochQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_epochquery_free(ptr >>> 0, 1));
/**
 * Query for epochs
 */
export class EpochQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EpochQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_epochquery_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.epochquery_new();
        this.__wbg_ptr = ret >>> 0;
        EpochQueryFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} epoch
     */
    set setStartEpoch(epoch) {
        wasm.epochquery_set_setStartEpoch(this.__wbg_ptr, epoch);
    }
    /**
     * @param {number} count
     */
    set count(count) {
        wasm.epochquery_set_count(this.__wbg_ptr, count);
    }
    /**
     * @param {boolean} ascending
     */
    set ascending(ascending) {
        wasm.epochquery_set_ascending(this.__wbg_ptr, ascending);
    }
    /**
     * @returns {number | undefined}
     */
    get startEpoch() {
        const ret = wasm.epochquery_startEpoch(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get count() {
        const ret = wasm.epochquery_count(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {boolean}
     */
    get ascending() {
        const ret = wasm.epochquery_ascending(this.__wbg_ptr);
        return ret !== 0;
    }
}

const EvonodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_evonode_free(ptr >>> 0, 1));
/**
 * Represents an evonode (evolution node) in the Dash Platform
 */
export class Evonode {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Evonode.prototype);
        obj.__wbg_ptr = ptr;
        EvonodeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EvonodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_evonode_free(ptr, 0);
    }
    /**
     * Get the ProTxHash
     * @returns {Uint8Array}
     */
    get proTxHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evonode_proTxHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the owner address
     * @returns {string}
     */
    get ownerAddress() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evonode_ownerAddress(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the voting address
     * @returns {string}
     */
    get votingAddress() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evonode_votingAddress(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Check if this is a high-performance masternode
     * @returns {boolean}
     */
    get isHPMN() {
        const ret = wasm.evonode_isHPMN(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the platform P2P port
     * @returns {number}
     */
    get platformP2PPort() {
        const ret = wasm.evonode_platformP2PPort(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the platform HTTP port
     * @returns {number}
     */
    get platformHTTPPort() {
        const ret = wasm.evonode_platformHTTPPort(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the node IP address
     * @returns {string}
     */
    get nodeIP() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evonode_nodeIP(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.evonode_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const FeatureFlagsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_featureflags_free(ptr >>> 0, 1));
/**
 * Feature flags for conditional compilation
 */
export class FeatureFlags {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FeatureFlags.prototype);
        obj.__wbg_ptr = ptr;
        FeatureFlagsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FeatureFlagsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_featureflags_free(ptr, 0);
    }
    /**
     * Create default feature flags (all enabled)
     */
    constructor() {
        const ret = wasm.featureflags_new();
        this.__wbg_ptr = ret >>> 0;
        FeatureFlagsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create minimal feature flags (only essentials)
     * @returns {FeatureFlags}
     */
    static minimal() {
        const ret = wasm.featureflags_minimal();
        return FeatureFlags.__wrap(ret);
    }
    /**
     * Enable identity features
     * @param {boolean} enable
     */
    setEnableIdentity(enable) {
        wasm.featureflags_setEnableIdentity(this.__wbg_ptr, enable);
    }
    /**
     * Enable contract features
     * @param {boolean} enable
     */
    setEnableContracts(enable) {
        wasm.featureflags_setEnableContracts(this.__wbg_ptr, enable);
    }
    /**
     * Enable document features
     * @param {boolean} enable
     */
    setEnableDocuments(enable) {
        wasm.featureflags_setEnableDocuments(this.__wbg_ptr, enable);
    }
    /**
     * Enable token features
     * @param {boolean} enable
     */
    setEnableTokens(enable) {
        wasm.featureflags_setEnableTokens(this.__wbg_ptr, enable);
    }
    /**
     * Enable withdrawal features
     * @param {boolean} enable
     */
    setEnableWithdrawals(enable) {
        wasm.featureflags_setEnableWithdrawals(this.__wbg_ptr, enable);
    }
    /**
     * Enable voting features
     * @param {boolean} enable
     */
    setEnableVoting(enable) {
        wasm.featureflags_setEnableVoting(this.__wbg_ptr, enable);
    }
    /**
     * Enable cache features
     * @param {boolean} enable
     */
    setEnableCache(enable) {
        wasm.featureflags_setEnableCache(this.__wbg_ptr, enable);
    }
    /**
     * Enable proof verification
     * @param {boolean} enable
     */
    setEnableProofVerification(enable) {
        wasm.featureflags_setEnableProofVerification(this.__wbg_ptr, enable);
    }
    /**
     * Get estimated bundle size reduction
     * @returns {string}
     */
    getEstimatedSizeReduction() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.featureflags_getEstimatedSizeReduction(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}

const FetchManyOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fetchmanyoptions_free(ptr >>> 0, 1));

export class FetchManyOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FetchManyOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fetchmanyoptions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.fetchmanyoptions_new();
        this.__wbg_ptr = ret >>> 0;
        FetchManyOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean} prove
     */
    setProve(prove) {
        wasm.fetchmanyoptions_setProve(this.__wbg_ptr, prove);
    }
}

const FetchManyResponseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fetchmanyresponse_free(ptr >>> 0, 1));

export class FetchManyResponse {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FetchManyResponse.prototype);
        obj.__wbg_ptr = ptr;
        FetchManyResponseFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FetchManyResponseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fetchmanyresponse_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get items() {
        const ret = wasm.fetchmanyresponse_items(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get metadata() {
        const ret = wasm.fetchmanyresponse_metadata(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const FetchOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_fetchoptions_free(ptr >>> 0, 1));
/**
 * Options for fetch operations
 */
export class FetchOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(FetchOptions.prototype);
        obj.__wbg_ptr = ptr;
        FetchOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FetchOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fetchoptions_free(ptr, 0);
    }
    /**
     * Number of retries for the request
     * @returns {number | undefined}
     */
    get retries() {
        const ret = wasm.__wbg_get_fetchoptions_retries(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * Number of retries for the request
     * @param {number | null} [arg0]
     */
    set retries(arg0) {
        wasm.__wbg_set_fetchoptions_retries(this.__wbg_ptr, isLikeNone(arg0) ? 0x100000001 : (arg0) >>> 0);
    }
    /**
     * Timeout in milliseconds
     * @returns {number | undefined}
     */
    get timeout() {
        const ret = wasm.__wbg_get_fetchoptions_timeout(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * Timeout in milliseconds
     * @param {number | null} [arg0]
     */
    set timeout(arg0) {
        wasm.__wbg_set_fetchoptions_timeout(this.__wbg_ptr, isLikeNone(arg0) ? 0x100000001 : (arg0) >>> 0);
    }
    /**
     * Whether to request proof
     * @returns {boolean | undefined}
     */
    get prove() {
        const ret = wasm.__wbg_get_fetchoptions_prove(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * Whether to request proof
     * @param {boolean | null} [arg0]
     */
    set prove(arg0) {
        wasm.__wbg_set_fetchoptions_prove(this.__wbg_ptr, isLikeNone(arg0) ? 0xFFFFFF : arg0 ? 1 : 0);
    }
    constructor() {
        const ret = wasm.fetchoptions_new();
        this.__wbg_ptr = ret >>> 0;
        FetchOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set the number of retries
     * @param {number} retries
     * @returns {FetchOptions}
     */
    withRetries(retries) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.fetchoptions_withRetries(ptr, retries);
        return FetchOptions.__wrap(ret);
    }
    /**
     * Set the timeout in milliseconds
     * @param {number} timeout_ms
     * @returns {FetchOptions}
     */
    withTimeout(timeout_ms) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.fetchoptions_withTimeout(ptr, timeout_ms);
        return FetchOptions.__wrap(ret);
    }
    /**
     * Set whether to request proof
     * @param {boolean} prove
     * @returns {FetchOptions}
     */
    withProve(prove) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.fetchoptions_withProve(ptr, prove);
        return FetchOptions.__wrap(ret);
    }
}

const GroupFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_group_free(ptr >>> 0, 1));
/**
 * Group information
 */
export class Group {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Group.prototype);
        obj.__wbg_ptr = ptr;
        GroupFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_group_free(ptr, 0);
    }
    /**
     * Get group ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.group_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get group name
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.group_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get group description
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.group_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get group type
     * @returns {string}
     */
    get groupType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.group_groupType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get creation timestamp
     * @returns {bigint}
     */
    get createdAt() {
        const ret = wasm.group_createdAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get member count
     * @returns {number}
     */
    get memberCount() {
        const ret = wasm.group_memberCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get threshold for actions
     * @returns {number}
     */
    get threshold() {
        const ret = wasm.group_threshold(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Check if group is active
     * @returns {boolean}
     */
    get active() {
        const ret = wasm.group_active(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.group_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const GroupMemberFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groupmember_free(ptr >>> 0, 1));
/**
 * Group member information
 */
export class GroupMember {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupMemberFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groupmember_free(ptr, 0);
    }
    /**
     * Get member identity ID
     * @returns {string}
     */
    get identityId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupmember_identityId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get member role
     * @returns {string}
     */
    get role() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupmember_role(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get join timestamp
     * @returns {bigint}
     */
    get joinedAt() {
        const ret = wasm.groupmember_joinedAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get permissions
     * @returns {Array<any>}
     */
    get permissions() {
        const ret = wasm.groupmember_permissions(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Check if member has permission
     * @param {string} permission
     * @returns {boolean}
     */
    hasPermission(permission) {
        const ptr0 = passStringToWasm0(permission, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.groupmember_hasPermission(this.__wbg_ptr, ptr0, len0);
        return ret !== 0;
    }
}

const GroupProposalFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_groupproposal_free(ptr >>> 0, 1));
/**
 * Group action proposal
 */
export class GroupProposal {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        GroupProposalFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_groupproposal_free(ptr, 0);
    }
    /**
     * Get proposal ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get group ID
     * @returns {string}
     */
    get groupId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_groupId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get proposer ID
     * @returns {string}
     */
    get proposerId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_proposerId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get title
     * @returns {string}
     */
    get title() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_title(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get description
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get action type
     * @returns {string}
     */
    get actionType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_actionType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get action data
     * @returns {Uint8Array}
     */
    get actionData() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_actionData(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get creation timestamp
     * @returns {bigint}
     */
    get createdAt() {
        const ret = wasm.groupproposal_createdAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get expiration timestamp
     * @returns {bigint}
     */
    get expiresAt() {
        const ret = wasm.groupproposal_expiresAt(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get approval count
     * @returns {number}
     */
    get approvals() {
        const ret = wasm.groupproposal_approvals(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get rejection count
     * @returns {number}
     */
    get rejections() {
        const ret = wasm.groupproposal_rejections(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Check if executed
     * @returns {boolean}
     */
    get executed() {
        const ret = wasm.groupproposal_executed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check if proposal is active
     * @returns {boolean}
     */
    isActive() {
        const ret = wasm.groupproposal_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check if proposal is expired
     * @returns {boolean}
     */
    isExpired() {
        const ret = wasm.groupproposal_isExpired(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.groupproposal_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const HDSignerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_hdsigner_free(ptr >>> 0, 1));
/**
 * HD (Hierarchical Deterministic) key derivation for WASM
 */
export class HDSigner {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HDSignerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hdsigner_free(ptr, 0);
    }
    /**
     * Create a new HD signer from mnemonic
     * @param {string} mnemonic
     * @param {string} derivation_path
     */
    constructor(mnemonic, derivation_path) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(mnemonic, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(derivation_path, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            wasm.hdsigner_new(retptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            HDSignerFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Generate a new mnemonic
     * @param {number} word_count
     * @returns {string}
     */
    static generateMnemonic(word_count) {
        let deferred2_0;
        let deferred2_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hdsigner_generateMnemonic(retptr, word_count);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            var ptr1 = r0;
            var len1 = r1;
            if (r3) {
                ptr1 = 0; len1 = 0;
                throw takeObject(r2);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Derive a key at a specific index
     * @param {number} index
     * @returns {Uint8Array}
     */
    deriveKey(index) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hdsigner_deriveKey(retptr, this.__wbg_ptr, index);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the derivation path
     * @returns {string}
     */
    get derivationPath() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.documentverificationresult_documentsJson(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}

const HealthCheckResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_healthcheckresult_free(ptr >>> 0, 1));
/**
 * Health check result
 */
export class HealthCheckResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(HealthCheckResult.prototype);
        obj.__wbg_ptr = ptr;
        HealthCheckResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        HealthCheckResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_healthcheckresult_free(ptr, 0);
    }
    /**
     * Get overall status
     * @returns {string}
     */
    get status() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.healthcheckresult_status(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get individual check results
     * @returns {Map<any, any>}
     */
    get checks() {
        const ret = wasm.healthcheckresult_checks(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Get timestamp
     * @returns {number}
     */
    get timestamp() {
        const ret = wasm.healthcheckresult_timestamp(this.__wbg_ptr);
        return ret;
    }
}

const IdentifierQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identifierquery_free(ptr >>> 0, 1));
/**
 * Query by identifier
 */
export class IdentifierQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentifierQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identifierquery_free(ptr, 0);
    }
    /**
     * @param {string} id
     */
    constructor(id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.identifierquery_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            IdentifierQueryFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identifierquery_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}

const IdentifiersQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identifiersquery_free(ptr >>> 0, 1));
/**
 * Query for multiple identifiers
 */
export class IdentifiersQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentifiersQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identifiersquery_free(ptr, 0);
    }
    /**
     * @param {string[]} ids
     */
    constructor(ids) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(ids, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.identifiersquery_new(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            IdentifiersQueryFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string[]}
     */
    get ids() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identifiersquery_ids(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayJsValueFromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    get count() {
        const ret = wasm.identifiersquery_count(this.__wbg_ptr);
        return ret >>> 0;
    }
}

const IdentityBalanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identitybalance_free(ptr >>> 0, 1));
/**
 * Identity balance information
 */
export class IdentityBalance {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IdentityBalance.prototype);
        obj.__wbg_ptr = ptr;
        IdentityBalanceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentityBalanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identitybalance_free(ptr, 0);
    }
    /**
     * Get confirmed balance
     * @returns {bigint}
     */
    get confirmed() {
        const ret = wasm.identitybalance_confirmed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get unconfirmed balance
     * @returns {bigint}
     */
    get unconfirmed() {
        const ret = wasm.identitybalance_unconfirmed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get total balance (confirmed + unconfirmed)
     * @returns {bigint}
     */
    get total() {
        const ret = wasm.identitybalance_total(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitybalance_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const IdentityInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identityinfo_free(ptr >>> 0, 1));
/**
 * Combined identity info
 */
export class IdentityInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IdentityInfo.prototype);
        obj.__wbg_ptr = ptr;
        IdentityInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentityInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identityinfo_free(ptr, 0);
    }
    /**
     * Get identity ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identityinfo_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get balance info
     * @returns {IdentityBalance}
     */
    get balance() {
        const ret = wasm.identityinfo_balance(this.__wbg_ptr);
        return IdentityBalance.__wrap(ret);
    }
    /**
     * Get revision info
     * @returns {IdentityRevision}
     */
    get revision() {
        const ret = wasm.identityinfo_revision(this.__wbg_ptr);
        return IdentityRevision.__wrap(ret);
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identityinfo_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const IdentityRevisionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identityrevision_free(ptr >>> 0, 1));
/**
 * Identity revision information
 */
export class IdentityRevision {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IdentityRevision.prototype);
        obj.__wbg_ptr = ptr;
        IdentityRevisionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentityRevisionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identityrevision_free(ptr, 0);
    }
    /**
     * Get revision number
     * @returns {bigint}
     */
    get revision() {
        const ret = wasm.identitybalance_confirmed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get last update timestamp
     * @returns {bigint}
     */
    get updatedAt() {
        const ret = wasm.identitybalance_unconfirmed(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get number of public keys
     * @returns {number}
     */
    get publicKeysCount() {
        const ret = wasm.identityrevision_publicKeysCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identityrevision_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const IdentityTransitionBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identitytransitionbuilder_free(ptr >>> 0, 1));
/**
 * Builder for creating identity state transitions
 */
export class IdentityTransitionBuilder {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentityTransitionBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identitytransitionbuilder_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.identitytransitionbuilder_new();
        this.__wbg_ptr = ret >>> 0;
        IdentityTransitionBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} identity_id
     */
    setIdentityId(identity_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.identitytransitionbuilder_setIdentityId(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} revision
     */
    setRevision(revision) {
        wasm.identitytransitionbuilder_setRevision(this.__wbg_ptr, revision);
    }
    /**
     * @param {any} public_key
     */
    addPublicKey(public_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitytransitionbuilder_addPublicKey(retptr, this.__wbg_ptr, addHeapObject(public_key));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} public_keys
     */
    addPublicKeys(public_keys) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitytransitionbuilder_addPublicKeys(retptr, this.__wbg_ptr, addHeapObject(public_keys));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {number} key_id
     */
    disablePublicKey(key_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitytransitionbuilder_disablePublicKey(retptr, this.__wbg_ptr, key_id);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {any} key_ids
     */
    disablePublicKeys(key_ids) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitytransitionbuilder_disablePublicKeys(retptr, this.__wbg_ptr, addHeapObject(key_ids));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} asset_lock_proof_bytes
     * @returns {Uint8Array}
     */
    buildCreateTransition(asset_lock_proof_bytes) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(asset_lock_proof_bytes, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.identitytransitionbuilder_buildCreateTransition(retptr, ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {Uint8Array} asset_lock_proof_bytes
     * @returns {Uint8Array}
     */
    buildTopUpTransition(asset_lock_proof_bytes) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(asset_lock_proof_bytes, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.identitytransitionbuilder_buildTopUpTransition(retptr, ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {bigint} nonce
     * @param {number} signature_public_key_id
     * @param {bigint | null} [_public_keys_disabled_at]
     * @returns {Uint8Array}
     */
    buildUpdateTransition(nonce, signature_public_key_id, _public_keys_disabled_at) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitytransitionbuilder_buildUpdateTransition(retptr, ptr, nonce, addHeapObject(signature_public_key_id), !isLikeNone(_public_keys_disabled_at), isLikeNone(_public_keys_disabled_at) ? BigInt(0) : _public_keys_disabled_at);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const IdentityWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identitywasm_free(ptr >>> 0, 1));

export class IdentityWasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IdentityWasm.prototype);
        obj.__wbg_ptr = ptr;
        IdentityWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentityWasmFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identitywasm_free(ptr, 0);
    }
    /**
     * @param {number} platform_version
     */
    constructor(platform_version) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitywasm_new(retptr, platform_version);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            IdentityWasmFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitywasm_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {bigint}
     */
    get revision() {
        const ret = wasm.identitywasm_revision(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @param {Array<any>} public_keys
     * @returns {number}
     */
    setPublicKeys(public_keys) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitywasm_setPublicKeys(retptr, this.__wbg_ptr, addHeapObject(public_keys));
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    get balance() {
        const ret = wasm.identitywasm_balance(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    getBalance() {
        const ret = wasm.identitywasm_balance(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} balance
     */
    setBalance(balance) {
        wasm.identitywasm_setBalance(this.__wbg_ptr, balance);
    }
    /**
     * @param {number} amount
     * @returns {number}
     */
    increaseBalance(amount) {
        const ret = wasm.identitywasm_increaseBalance(this.__wbg_ptr, amount);
        return ret;
    }
    /**
     * @param {number} amount
     * @returns {number}
     */
    reduceBalance(amount) {
        const ret = wasm.identitywasm_reduceBalance(this.__wbg_ptr, amount);
        return ret;
    }
    /**
     * @param {number} revision
     */
    setRevision(revision) {
        wasm.identitywasm_setRevision(this.__wbg_ptr, revision);
    }
    /**
     * @returns {number}
     */
    getRevision() {
        const ret = wasm.identitywasm_getRevision(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {any}
     */
    toJSON() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitywasm_toJSON(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {Uint8Array}
     */
    hash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.identitywasm_hash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {number}
     */
    getPublicKeyMaxId() {
        const ret = wasm.identitywasm_getPublicKeyMaxId(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Uint8Array} buffer
     * @returns {IdentityWasm}
     */
    static fromBuffer(buffer) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(buffer, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.identitywasm_fromBuffer(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return IdentityWasm.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const LimitQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_limitquery_free(ptr >>> 0, 1));
/**
 * Query with limit and pagination support
 */
export class LimitQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LimitQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_limitquery_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.limitquery_new();
        this.__wbg_ptr = ret >>> 0;
        LimitQueryFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} limit
     */
    set limit(limit) {
        wasm.limitquery_set_limit(this.__wbg_ptr, limit);
    }
    /**
     * @param {number} offset
     */
    set offset(offset) {
        wasm.limitquery_set_offset(this.__wbg_ptr, offset);
    }
    /**
     * @param {Uint8Array} key
     */
    set setStartKey(key) {
        const ptr0 = passArray8ToWasm0(key, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.limitquery_set_setStartKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {boolean} included
     */
    set setStartIncluded(included) {
        wasm.limitquery_set_setStartIncluded(this.__wbg_ptr, included);
    }
    /**
     * @returns {number | undefined}
     */
    get limit() {
        const ret = wasm.limitquery_limit(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
    /**
     * @returns {number | undefined}
     */
    get offset() {
        const ret = wasm.limitquery_offset(this.__wbg_ptr);
        return ret === 0x100000001 ? undefined : ret;
    }
}

const MemoryOptimizerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_memoryoptimizer_free(ptr >>> 0, 1));
/**
 * Memory optimization utilities
 */
export class MemoryOptimizer {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MemoryOptimizerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_memoryoptimizer_free(ptr, 0);
    }
    /**
     * Create a new memory optimizer
     */
    constructor() {
        const ret = wasm.memoryoptimizer_new();
        this.__wbg_ptr = ret >>> 0;
        MemoryOptimizerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Track an allocation
     * @param {number} size
     */
    trackAllocation(size) {
        wasm.memoryoptimizer_trackAllocation(this.__wbg_ptr, size);
    }
    /**
     * Get allocation statistics
     * @returns {string}
     */
    getStats() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.memoryoptimizer_getStats(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Reset statistics
     */
    reset() {
        wasm.memoryoptimizer_reset(this.__wbg_ptr);
    }
    /**
     * Force garbage collection (hint to JS engine)
     */
    static forceGC() {
        wasm.memoryoptimizer_forceGC();
    }
}

const MetadataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_metadata_free(ptr >>> 0, 1));
/**
 * Metadata from a Platform response
 */
export class Metadata {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Metadata.prototype);
        obj.__wbg_ptr = ptr;
        MetadataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MetadataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadata_free(ptr, 0);
    }
    /**
     * Create new metadata
     * @param {bigint} height
     * @param {number} core_chain_locked_height
     * @param {number} epoch
     * @param {bigint} time_ms
     * @param {number} protocol_version
     * @param {string} chain_id
     */
    constructor(height, core_chain_locked_height, epoch, time_ms, protocol_version, chain_id) {
        const ptr0 = passStringToWasm0(chain_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.metadata_new(height, core_chain_locked_height, epoch, time_ms, protocol_version, ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        MetadataFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get the block height
     * @returns {bigint}
     */
    get height() {
        const ret = wasm.metadata_height(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get the core chain locked height
     * @returns {number}
     */
    get coreChainLockedHeight() {
        const ret = wasm.metadata_coreChainLockedHeight(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the epoch
     * @returns {number}
     */
    get epoch() {
        const ret = wasm.metadata_epoch(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the time in milliseconds
     * @returns {bigint}
     */
    get timeMs() {
        const ret = wasm.metadata_timeMs(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get the protocol version
     * @returns {number}
     */
    get protocolVersion() {
        const ret = wasm.metadata_protocolVersion(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the chain ID
     * @returns {string}
     */
    get chainId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadata_chainId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadata_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const MetadataVerificationConfigFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_metadataverificationconfig_free(ptr >>> 0, 1));
/**
 * Configuration for metadata verification
 */
export class MetadataVerificationConfig {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MetadataVerificationConfigFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadataverificationconfig_free(ptr, 0);
    }
    /**
     * Create default verification config
     */
    constructor() {
        const ret = wasm.metadataverificationconfig_new();
        this.__wbg_ptr = ret >>> 0;
        MetadataVerificationConfigFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set maximum height difference
     * @param {bigint} blocks
     */
    setMaxHeightDifference(blocks) {
        wasm.metadataverificationconfig_setMaxHeightDifference(this.__wbg_ptr, blocks);
    }
    /**
     * Set maximum time difference
     * @param {bigint} ms
     */
    setMaxTimeDifference(ms) {
        wasm.metadataverificationconfig_setMaxTimeDifference(this.__wbg_ptr, ms);
    }
    /**
     * Enable/disable time verification
     * @param {boolean} verify
     */
    setVerifyTime(verify) {
        wasm.metadataverificationconfig_setVerifyTime(this.__wbg_ptr, verify);
    }
    /**
     * Enable/disable height verification
     * @param {boolean} verify
     */
    setVerifyHeight(verify) {
        wasm.metadataverificationconfig_setVerifyHeight(this.__wbg_ptr, verify);
    }
    /**
     * Enable/disable chain ID verification
     * @param {boolean} verify
     */
    setVerifyChainId(verify) {
        wasm.metadataverificationconfig_setVerifyChainId(this.__wbg_ptr, verify);
    }
    /**
     * Set expected chain ID
     * @param {string} chain_id
     */
    setExpectedChainId(chain_id) {
        const ptr0 = passStringToWasm0(chain_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.metadataverificationconfig_setExpectedChainId(this.__wbg_ptr, ptr0, len0);
    }
}

const MetadataVerificationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_metadataverificationresult_free(ptr >>> 0, 1));
/**
 * Result of metadata verification
 */
export class MetadataVerificationResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MetadataVerificationResult.prototype);
        obj.__wbg_ptr = ptr;
        MetadataVerificationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MetadataVerificationResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadataverificationresult_free(ptr, 0);
    }
    /**
     * Check if metadata is valid
     * @returns {boolean}
     */
    get valid() {
        const ret = wasm.metadataverificationresult_valid(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check if height is valid
     * @returns {boolean | undefined}
     */
    get heightValid() {
        const ret = wasm.metadataverificationresult_heightValid(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * Check if time is valid
     * @returns {boolean | undefined}
     */
    get timeValid() {
        const ret = wasm.metadataverificationresult_timeValid(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * Check if chain ID is valid
     * @returns {boolean | undefined}
     */
    get chainIdValid() {
        const ret = wasm.metadataverificationresult_chainIdValid(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * Get height difference
     * @returns {bigint | undefined}
     */
    get heightDifference() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadataverificationresult_heightDifference(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get time difference in milliseconds
     * @returns {bigint | undefined}
     */
    get timeDifferenceMs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadataverificationresult_timeDifferenceMs(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get error message if validation failed
     * @returns {string | undefined}
     */
    get errorMessage() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadataverificationresult_errorMessage(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadataverificationresult_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const MnemonicFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_mnemonic_free(ptr >>> 0, 1));
/**
 * BIP39 mnemonic wrapper
 */
export class Mnemonic {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Mnemonic.prototype);
        obj.__wbg_ptr = ptr;
        MnemonicFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MnemonicFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_mnemonic_free(ptr, 0);
    }
    /**
     * Generate a new mnemonic with the specified strength and language
     * @param {MnemonicStrength} strength
     * @param {WordListLanguage | null} [language]
     * @returns {Mnemonic}
     */
    static generate(strength, language) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_generate(retptr, strength, isLikeNone(language) ? 10 : language);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Mnemonic.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a mnemonic from an existing phrase
     * @param {string} phrase
     * @param {WordListLanguage | null} [language]
     * @returns {Mnemonic}
     */
    static fromPhrase(phrase, language) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.mnemonic_fromPhrase(retptr, ptr0, len0, isLikeNone(language) ? 10 : language);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Mnemonic.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Create a mnemonic from entropy
     * @param {Uint8Array} entropy
     * @param {WordListLanguage | null} [language]
     * @returns {Mnemonic}
     */
    static fromEntropy(entropy, language) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(entropy, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            wasm.mnemonic_fromEntropy(retptr, ptr0, len0, isLikeNone(language) ? 10 : language);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return Mnemonic.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the mnemonic phrase as a string
     * @returns {string}
     */
    get phrase() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.mnemonic_phrase(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the mnemonic words as an array
     * @returns {Array<any>}
     */
    get words() {
        const ret = wasm.mnemonic_words(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Get the number of words
     * @returns {number}
     */
    get wordCount() {
        const ret = wasm.mnemonic_wordCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the entropy as bytes
     * @returns {Uint8Array}
     */
    get entropy() {
        const ret = wasm.mnemonic_entropy(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Generate seed from the mnemonic with optional passphrase
     * @param {string | null} [passphrase]
     * @returns {Uint8Array}
     */
    toSeed(passphrase) {
        var ptr0 = isLikeNone(passphrase) ? 0 : passStringToWasm0(passphrase, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.mnemonic_toSeed(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Validate a mnemonic phrase
     * @param {string} phrase
     * @param {WordListLanguage | null} [language]
     * @returns {boolean}
     */
    static validate(phrase, language) {
        const ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.mnemonic_validate(ptr0, len0, isLikeNone(language) ? 10 : language);
        return ret !== 0;
    }
}

const NonceOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nonceoptions_free(ptr >>> 0, 1));
/**
 * Options for fetching nonces
 */
export class NonceOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NonceOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nonceoptions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.nonceoptions_new();
        this.__wbg_ptr = ret >>> 0;
        NonceOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {boolean} cached
     */
    setCached(cached) {
        wasm.nonceoptions_setCached(this.__wbg_ptr, cached);
    }
    /**
     * @param {boolean} prove
     */
    setProve(prove) {
        wasm.nonceoptions_setProve(this.__wbg_ptr, prove);
    }
}

const NonceResponseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_nonceresponse_free(ptr >>> 0, 1));
/**
 * Response containing nonce information
 */
export class NonceResponse {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        NonceResponseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nonceresponse_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get nonce() {
        const ret = wasm.nonceresponse_nonce(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * @returns {any}
     */
    get metadata() {
        const ret = wasm.nonceresponse_metadata(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const PerformanceMetricsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_performancemetrics_free(ptr >>> 0, 1));
/**
 * Performance metrics for operations
 */
export class PerformanceMetrics {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PerformanceMetricsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_performancemetrics_free(ptr, 0);
    }
    /**
     * Get operation name
     * @returns {string}
     */
    get operation() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.performancemetrics_operation(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get duration in milliseconds
     * @returns {number | undefined}
     */
    get duration() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.performancemetrics_duration(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get success status
     * @returns {boolean | undefined}
     */
    get success() {
        const ret = wasm.performancemetrics_success(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret !== 0;
    }
    /**
     * Get error message
     * @returns {string | undefined}
     */
    get errorMessage() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.performancemetrics_errorMessage(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.performancemetrics_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const PerformanceMonitorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_performancemonitor_free(ptr >>> 0, 1));
/**
 * Performance monitoring
 */
export class PerformanceMonitor {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PerformanceMonitorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_performancemonitor_free(ptr, 0);
    }
    /**
     * Create a new performance monitor
     */
    constructor() {
        const ret = wasm.performancemonitor_new();
        this.__wbg_ptr = ret >>> 0;
        PerformanceMonitorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Mark a performance point
     * @param {string} label
     */
    mark(label) {
        const ptr0 = passStringToWasm0(label, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.performancemonitor_mark(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Get performance report
     * @returns {string}
     */
    getReport() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.performancemonitor_getReport(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Reset measurements
     */
    reset() {
        wasm.performancemonitor_reset(this.__wbg_ptr);
    }
}

const PrefundedBalanceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_prefundedbalance_free(ptr >>> 0, 1));
/**
 * Prefunded balance information
 */
export class PrefundedBalance {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PrefundedBalance.prototype);
        obj.__wbg_ptr = ptr;
        PrefundedBalanceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrefundedBalanceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_prefundedbalance_free(ptr, 0);
    }
    /**
     * Get balance type
     * @returns {string}
     */
    get balanceType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.prefundedbalance_balanceType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get amount
     * @returns {bigint}
     */
    get amount() {
        const ret = wasm.prefundedbalance_amount(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get lock expiry timestamp
     * @returns {bigint | undefined}
     */
    get lockedUntil() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.prefundedbalance_lockedUntil(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get purpose description
     * @returns {string}
     */
    get purpose() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.prefundedbalance_purpose(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Check if withdrawable
     * @returns {boolean}
     */
    get canWithdraw() {
        const ret = wasm.prefundedbalance_canWithdraw(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check if currently locked
     * @returns {boolean}
     */
    isLocked() {
        const ret = wasm.prefundedbalance_isLocked(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get remaining lock time in milliseconds
     * @returns {bigint}
     */
    getRemainingLockTime() {
        const ret = wasm.prefundedbalance_getRemainingLockTime(this.__wbg_ptr);
        return ret;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.prefundedbalance_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const RequestSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_requestsettings_free(ptr >>> 0, 1));
/**
 * Request settings for DAPI calls
 */
export class RequestSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RequestSettings.prototype);
        obj.__wbg_ptr = ptr;
        RequestSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RequestSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_requestsettings_free(ptr, 0);
    }
    /**
     * Create default request settings
     */
    constructor() {
        const ret = wasm.requestsettings_new();
        this.__wbg_ptr = ret >>> 0;
        RequestSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set maximum retries
     * @param {number} retries
     */
    setMaxRetries(retries) {
        wasm.requestsettings_setMaxRetries(this.__wbg_ptr, retries);
    }
    /**
     * Set initial retry delay
     * @param {number} delay_ms
     */
    setInitialRetryDelay(delay_ms) {
        wasm.requestsettings_setInitialRetryDelay(this.__wbg_ptr, delay_ms);
    }
    /**
     * Set maximum retry delay
     * @param {number} delay_ms
     */
    setMaxRetryDelay(delay_ms) {
        wasm.requestsettings_setMaxRetryDelay(this.__wbg_ptr, delay_ms);
    }
    /**
     * Set backoff multiplier
     * @param {number} multiplier
     */
    setBackoffMultiplier(multiplier) {
        wasm.requestsettings_setBackoffMultiplier(this.__wbg_ptr, multiplier);
    }
    /**
     * Set request timeout
     * @param {number} timeout_ms
     */
    setTimeout(timeout_ms) {
        wasm.requestsettings_setTimeout(this.__wbg_ptr, timeout_ms);
    }
    /**
     * Enable/disable exponential backoff
     * @param {boolean} use_backoff
     */
    setUseExponentialBackoff(use_backoff) {
        wasm.requestsettings_setUseExponentialBackoff(this.__wbg_ptr, use_backoff);
    }
    /**
     * Enable/disable retry on timeout
     * @param {boolean} retry
     */
    setRetryOnTimeout(retry) {
        wasm.requestsettings_setRetryOnTimeout(this.__wbg_ptr, retry);
    }
    /**
     * Enable/disable retry on network error
     * @param {boolean} retry
     */
    setRetryOnNetworkError(retry) {
        wasm.requestsettings_setRetryOnNetworkError(this.__wbg_ptr, retry);
    }
    /**
     * Set custom headers
     * @param {object} headers
     */
    setCustomHeaders(headers) {
        wasm.requestsettings_setCustomHeaders(this.__wbg_ptr, addHeapObject(headers));
    }
    /**
     * Get the delay for a specific retry attempt
     * @param {number} attempt
     * @returns {number}
     */
    getRetryDelay(attempt) {
        const ret = wasm.requestsettings_getRetryDelay(this.__wbg_ptr, attempt);
        return ret >>> 0;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.requestsettings_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const RequestSettingsBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_requestsettingsbuilder_free(ptr >>> 0, 1));
/**
 * Builder for creating customized request settings
 */
export class RequestSettingsBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RequestSettingsBuilder.prototype);
        obj.__wbg_ptr = ptr;
        RequestSettingsBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RequestSettingsBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_requestsettingsbuilder_free(ptr, 0);
    }
    /**
     * Create a new builder
     */
    constructor() {
        const ret = wasm.requestsettingsbuilder_new();
        this.__wbg_ptr = ret >>> 0;
        RequestSettingsBuilderFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set max retries
     * @param {number} retries
     * @returns {RequestSettingsBuilder}
     */
    withMaxRetries(retries) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.requestsettingsbuilder_withMaxRetries(ptr, retries);
        return RequestSettingsBuilder.__wrap(ret);
    }
    /**
     * Set timeout
     * @param {number} timeout_ms
     * @returns {RequestSettingsBuilder}
     */
    withTimeout(timeout_ms) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.requestsettingsbuilder_withTimeout(ptr, timeout_ms);
        return RequestSettingsBuilder.__wrap(ret);
    }
    /**
     * Set initial retry delay
     * @param {number} delay_ms
     * @returns {RequestSettingsBuilder}
     */
    withInitialRetryDelay(delay_ms) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.requestsettingsbuilder_withInitialRetryDelay(ptr, delay_ms);
        return RequestSettingsBuilder.__wrap(ret);
    }
    /**
     * Set backoff multiplier
     * @param {number} multiplier
     * @returns {RequestSettingsBuilder}
     */
    withBackoffMultiplier(multiplier) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.requestsettingsbuilder_withBackoffMultiplier(ptr, multiplier);
        return RequestSettingsBuilder.__wrap(ret);
    }
    /**
     * Disable retries
     * @returns {RequestSettingsBuilder}
     */
    withoutRetries() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.requestsettingsbuilder_withoutRetries(ptr);
        return RequestSettingsBuilder.__wrap(ret);
    }
    /**
     * Build the settings
     * @returns {RequestSettings}
     */
    build() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.requestsettingsbuilder_build(ptr);
        return RequestSettings.__wrap(ret);
    }
}

const RetryHandlerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_retryhandler_free(ptr >>> 0, 1));
/**
 * Retry handler for WASM environment
 */
export class RetryHandler {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RetryHandlerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_retryhandler_free(ptr, 0);
    }
    /**
     * Create a new retry handler
     * @param {RequestSettings} settings
     */
    constructor(settings) {
        _assertClass(settings, RequestSettings);
        var ptr0 = settings.__destroy_into_raw();
        const ret = wasm.retryhandler_new(ptr0);
        this.__wbg_ptr = ret >>> 0;
        RetryHandlerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Check if we should retry
     * @param {any} error
     * @returns {boolean}
     */
    shouldRetry(error) {
        try {
            const ret = wasm.retryhandler_shouldRetry(this.__wbg_ptr, addBorrowedObject(error));
            return ret !== 0;
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }
    /**
     * Get the next retry delay
     * @returns {number}
     */
    getNextRetryDelay() {
        const ret = wasm.retryhandler_getNextRetryDelay(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Increment attempt counter
     */
    incrementAttempt() {
        wasm.retryhandler_incrementAttempt(this.__wbg_ptr);
    }
    /**
     * Get current attempt number
     * @returns {number}
     */
    get currentAttempt() {
        const ret = wasm.retryhandler_currentAttempt(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get elapsed time in milliseconds
     * @returns {number}
     */
    getElapsedTime() {
        const ret = wasm.retryhandler_getElapsedTime(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if timeout exceeded
     * @returns {boolean}
     */
    isTimeoutExceeded() {
        const ret = wasm.retryhandler_isTimeoutExceeded(this.__wbg_ptr);
        return ret !== 0;
    }
}

const SchemaChangeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_schemachange_free(ptr >>> 0, 1));
/**
 * Contract schema change
 */
export class SchemaChange {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SchemaChangeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_schemachange_free(ptr, 0);
    }
    /**
     * Get document type
     * @returns {string}
     */
    get documentType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.schemachange_documentType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get change type
     * @returns {string}
     */
    get changeType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.schemachange_changeType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get field name
     * @returns {string | undefined}
     */
    get fieldName() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.schemachange_fieldName(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get old value
     * @returns {string | undefined}
     */
    get oldValue() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.schemachange_oldValue(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get new value
     * @returns {string | undefined}
     */
    get newValue() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.schemachange_newValue(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const SdkMonitorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sdkmonitor_free(ptr >>> 0, 1));
/**
 * SDK Monitor for tracking operations and performance
 */
export class SdkMonitor {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SdkMonitorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sdkmonitor_free(ptr, 0);
    }
    /**
     * Create a new monitor
     * @param {boolean} enabled
     * @param {number | null} [max_metrics]
     */
    constructor(enabled, max_metrics) {
        const ret = wasm.sdkmonitor_new(enabled, isLikeNone(max_metrics) ? 0x100000001 : (max_metrics) >>> 0);
        this.__wbg_ptr = ret >>> 0;
        SdkMonitorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Check if monitoring is enabled
     * @returns {boolean}
     */
    get enabled() {
        const ret = wasm.sdkmonitor_enabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Enable monitoring
     */
    enable() {
        wasm.sdkmonitor_enable(this.__wbg_ptr);
    }
    /**
     * Disable monitoring
     */
    disable() {
        wasm.sdkmonitor_disable(this.__wbg_ptr);
    }
    /**
     * Start tracking an operation
     * @param {string} operation_id
     * @param {string} operation_name
     */
    startOperation(operation_id, operation_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(operation_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(operation_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            wasm.sdkmonitor_startOperation(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * End tracking an operation
     * @param {string} operation_id
     * @param {boolean} success
     * @param {string | null} [error_message]
     */
    endOperation(operation_id, success, error_message) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(operation_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            var ptr1 = isLikeNone(error_message) ? 0 : passStringToWasm0(error_message, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            var len1 = WASM_VECTOR_LEN;
            wasm.sdkmonitor_endOperation(retptr, this.__wbg_ptr, ptr0, len0, success, ptr1, len1);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Add metadata to an active operation
     * @param {string} operation_id
     * @param {string} key
     * @param {string} value
     */
    addOperationMetadata(operation_id, key, value) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(operation_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(value, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len2 = WASM_VECTOR_LEN;
            wasm.sdkmonitor_addOperationMetadata(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get all collected metrics
     * @returns {Array<any>}
     */
    getMetrics() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sdkmonitor_getMetrics(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get metrics for a specific operation type
     * @param {string} operation_name
     * @returns {Array<any>}
     */
    getMetricsByOperation(operation_name) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(operation_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.sdkmonitor_getMetricsByOperation(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get operation statistics
     * @returns {any}
     */
    getOperationStats() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sdkmonitor_getOperationStats(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Clear all metrics
     */
    clearMetrics() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sdkmonitor_clearMetrics(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get active operations count
     * @returns {number}
     */
    getActiveOperationsCount() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.sdkmonitor_getActiveOperationsCount(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return r0 >>> 0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const SingleDocumentDriveQueryWasmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_singledocumentdrivequerywasm_free(ptr >>> 0, 1));
/**
 * WASM wrapper for SingleDocumentDriveQuery
 */
export class SingleDocumentDriveQueryWasm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SingleDocumentDriveQueryWasm.prototype);
        obj.__wbg_ptr = ptr;
        SingleDocumentDriveQueryWasmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SingleDocumentDriveQueryWasmFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_singledocumentdrivequerywasm_free(ptr, 0);
    }
    /**
     * Create a new SingleDocumentDriveQuery
     * @param {Uint8Array} contract_id
     * @param {string} document_type_name
     * @param {boolean} document_type_keeps_history
     * @param {Uint8Array} document_id
     * @param {number | null | undefined} block_time_ms
     * @param {number} contested_status
     */
    constructor(contract_id, document_type_name, document_type_keeps_history, document_id, block_time_ms, contested_status) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(contract_id, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(document_type_name, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passArray8ToWasm0(document_id, wasm.__wbindgen_export_0);
            const len2 = WASM_VECTOR_LEN;
            wasm.singledocumentdrivequerywasm_new(retptr, ptr0, len0, ptr1, len1, document_type_keeps_history, ptr2, len2, !isLikeNone(block_time_ms), isLikeNone(block_time_ms) ? 0 : block_time_ms, contested_status);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            this.__wbg_ptr = r0 >>> 0;
            SingleDocumentDriveQueryWasmFinalization.register(this, this.__wbg_ptr, this);
            return this;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the contract ID
     * @returns {Uint8Array}
     */
    get contractId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentdrivequerywasm_contractId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the document type name
     * @returns {string}
     */
    get documentTypeName() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentdrivequerywasm_documentTypeName(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get whether the document type keeps history
     * @returns {boolean}
     */
    get documentTypeKeepsHistory() {
        const ret = wasm.singledocumentdrivequerywasm_documentTypeKeepsHistory(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the document ID
     * @returns {Uint8Array}
     */
    get documentId() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentdrivequerywasm_documentId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the block time in milliseconds
     * @returns {number | undefined}
     */
    get blockTimeMs() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentdrivequerywasm_blockTimeMs(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getFloat64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : r2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the contested status
     * @returns {number}
     */
    get contestedStatus() {
        const ret = wasm.singledocumentdrivequerywasm_contestedStatus(this.__wbg_ptr);
        return ret;
    }
}

const SingleDocumentProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_singledocumentproofresult_free(ptr >>> 0, 1));
/**
 * Result of a single document proof verification
 */
export class SingleDocumentProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SingleDocumentProofResult.prototype);
        obj.__wbg_ptr = ptr;
        SingleDocumentProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SingleDocumentProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_singledocumentproofresult_free(ptr, 0);
    }
    /**
     * Get the root hash
     * @returns {Uint8Array}
     */
    get rootHash() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentproofresult_rootHash(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Get the serialized document (if found)
     * @returns {Uint8Array | undefined}
     */
    get documentSerialized() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentproofresult_documentSerialized(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Check if a document was found
     * @returns {boolean}
     */
    hasDocument() {
        const ret = wasm.singledocumentproofresult_hasDocument(this.__wbg_ptr);
        return ret !== 0;
    }
}

const SubscriptionHandleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_subscriptionhandle_free(ptr >>> 0, 1));
/**
 * WebSocket subscription handle
 */
export class SubscriptionHandle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SubscriptionHandle.prototype);
        obj.__wbg_ptr = ptr;
        SubscriptionHandleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SubscriptionHandleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_subscriptionhandle_free(ptr, 0);
    }
    /**
     * Get the subscription ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriptionhandle_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Close the subscription
     */
    close() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriptionhandle_close(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Check if the subscription is active
     * @returns {boolean}
     */
    get isActive() {
        const ret = wasm.subscriptionhandle_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
}

const SubscriptionHandleV2Finalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_subscriptionhandlev2_free(ptr >>> 0, 1));
/**
 * Enhanced WebSocket subscription handle with automatic cleanup
 */
export class SubscriptionHandleV2 {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SubscriptionHandleV2.prototype);
        obj.__wbg_ptr = ptr;
        SubscriptionHandleV2Finalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SubscriptionHandleV2Finalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_subscriptionhandlev2_free(ptr, 0);
    }
    /**
     * Get the subscription ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriptionhandlev2_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Close the subscription and clean up resources
     */
    close() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.subscriptionhandlev2_close(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Check if the subscription is active
     * @returns {boolean}
     */
    get isActive() {
        const ret = wasm.subscriptionhandlev2_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
}

const SubscriptionOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_subscriptionoptions_free(ptr >>> 0, 1));
/**
 * Connection options for subscriptions
 */
export class SubscriptionOptions {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SubscriptionOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_subscriptionoptions_free(ptr, 0);
    }
    /**
     * Reconnect automatically on disconnect
     * @returns {boolean}
     */
    get auto_reconnect() {
        const ret = wasm.__wbg_get_subscriptionoptions_auto_reconnect(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Reconnect automatically on disconnect
     * @param {boolean} arg0
     */
    set auto_reconnect(arg0) {
        wasm.__wbg_set_subscriptionoptions_auto_reconnect(this.__wbg_ptr, arg0);
    }
    /**
     * Maximum reconnection attempts
     * @returns {number}
     */
    get max_reconnect_attempts() {
        const ret = wasm.__wbg_get_subscriptionoptions_max_reconnect_attempts(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Maximum reconnection attempts
     * @param {number} arg0
     */
    set max_reconnect_attempts(arg0) {
        wasm.__wbg_set_subscriptionoptions_max_reconnect_attempts(this.__wbg_ptr, arg0);
    }
    /**
     * Reconnection delay in milliseconds
     * @returns {number}
     */
    get reconnect_delay_ms() {
        const ret = wasm.__wbg_get_subscriptionoptions_reconnect_delay_ms(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Reconnection delay in milliseconds
     * @param {number} arg0
     */
    set reconnect_delay_ms(arg0) {
        wasm.__wbg_set_subscriptionoptions_reconnect_delay_ms(this.__wbg_ptr, arg0);
    }
    /**
     * Connection timeout in milliseconds
     * @returns {number}
     */
    get connection_timeout_ms() {
        const ret = wasm.__wbg_get_subscriptionoptions_connection_timeout_ms(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Connection timeout in milliseconds
     * @param {number} arg0
     */
    set connection_timeout_ms(arg0) {
        wasm.__wbg_set_subscriptionoptions_connection_timeout_ms(this.__wbg_ptr, arg0);
    }
    constructor() {
        const ret = wasm.subscriptionoptions_new();
        this.__wbg_ptr = ret >>> 0;
        SubscriptionOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const TokenMetadataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tokenmetadata_free(ptr >>> 0, 1));
/**
 * Token metadata structure
 */
export class TokenMetadata {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TokenMetadataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokenmetadata_free(ptr, 0);
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenmetadata_name(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {string}
     */
    get symbol() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenmetadata_symbol(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @returns {number}
     */
    get decimals() {
        const ret = wasm.tokenmetadata_decimals(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string | undefined}
     */
    get iconUrl() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenmetadata_iconUrl(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {string | undefined}
     */
    get description() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.tokenmetadata_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const TokenOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tokenoptions_free(ptr >>> 0, 1));
/**
 * Options for token operations
 */
export class TokenOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TokenOptions.prototype);
        obj.__wbg_ptr = ptr;
        TokenOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TokenOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokenoptions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.tokenoptions_new();
        this.__wbg_ptr = ret >>> 0;
        TokenOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set the number of retries
     * @param {number} retries
     * @returns {TokenOptions}
     */
    withRetries(retries) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.tokenoptions_withRetries(ptr, retries);
        return TokenOptions.__wrap(ret);
    }
    /**
     * Set the timeout in milliseconds
     * @param {number} timeout_ms
     * @returns {TokenOptions}
     */
    withTimeout(timeout_ms) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.tokenoptions_withTimeout(ptr, timeout_ms);
        return TokenOptions.__wrap(ret);
    }
}

const TokenTransitionPathQueryResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tokentransitionpathqueryresult_free(ptr >>> 0, 1));

export class TokenTransitionPathQueryResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(TokenTransitionPathQueryResult.prototype);
        obj.__wbg_ptr = ptr;
        TokenTransitionPathQueryResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TokenTransitionPathQueryResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tokentransitionpathqueryresult_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    get path_query() {
        const ret = wasm.tokentransitionpathqueryresult_path_query(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyActionInfosInContractResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyactioninfosincontractresult_free(ptr >>> 0, 1));

export class VerifyActionInfosInContractResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyActionInfosInContractResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyActionInfosInContractResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyActionInfosInContractResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyactioninfosincontractresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get actions() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyActionSignersResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyactionsignersresult_free(ptr >>> 0, 1));

export class VerifyActionSignersResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyActionSignersResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyActionSignersResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyActionSignersResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyactionsignersresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get signers() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyActionSignersTotalPowerResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyactionsignerstotalpowerresult_free(ptr >>> 0, 1));

export class VerifyActionSignersTotalPowerResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyActionSignersTotalPowerResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyActionSignersTotalPowerResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyActionSignersTotalPowerResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyactionsignerstotalpowerresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactionsignerstotalpowerresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {number}
     */
    get action_status() {
        const ret = wasm.verifyactionsignerstotalpowerresult_action_status(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {bigint}
     */
    get total_power() {
        const ret = wasm.verifyactionsignerstotalpowerresult_total_power(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}

const VerifyContestsProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifycontestsproofresult_free(ptr >>> 0, 1));

export class VerifyContestsProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyContestsProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyContestsProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyContestsProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifycontestsproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifycontestsproofresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Array<any>}
     */
    get contests() {
        const ret = wasm.verifycontestsproofresult_contests(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyContractHistoryResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifycontracthistoryresult_free(ptr >>> 0, 1));

export class VerifyContractHistoryResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyContractHistoryResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyContractHistoryResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyContractHistoryResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifycontracthistoryresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get contract_history() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyContractResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifycontractresult_free(ptr >>> 0, 1));

export class VerifyContractResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyContractResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyContractResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyContractResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifycontractresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get contract() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyDocumentProofKeepSerializedResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifydocumentproofkeepserializedresult_free(ptr >>> 0, 1));

export class VerifyDocumentProofKeepSerializedResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyDocumentProofKeepSerializedResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyDocumentProofKeepSerializedResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyDocumentProofKeepSerializedResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifydocumentproofkeepserializedresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get serialized_documents() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyDocumentProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifydocumentproofresult_free(ptr >>> 0, 1));

export class VerifyDocumentProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyDocumentProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyDocumentProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyDocumentProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifydocumentproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get documents() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyDocumentQueryFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifydocumentquery_free(ptr >>> 0, 1));
/**
 * Query parameters for document verification
 */
export class VerifyDocumentQuery {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyDocumentQueryFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifydocumentquery_free(ptr, 0);
    }
    /**
     * @param {Uint8Array} contract_cbor
     * @param {string} document_type
     */
    constructor(contract_cbor, document_type) {
        const ptr0 = passArray8ToWasm0(contract_cbor, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(document_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.verifydocumentquery_new(ptr0, len0, ptr1, len1);
        this.__wbg_ptr = ret >>> 0;
        VerifyDocumentQueryFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {string} where_json
     */
    setWhere(where_json) {
        const ptr0 = passStringToWasm0(where_json, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifydocumentquery_setWhere(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {string} order_by_json
     */
    setOrderBy(order_by_json) {
        const ptr0 = passStringToWasm0(order_by_json, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifydocumentquery_setOrderBy(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {number} limit
     */
    setLimit(limit) {
        wasm.verifydocumentquery_setLimit(this.__wbg_ptr, limit);
    }
    /**
     * @param {Uint8Array} start_at
     */
    setStartAt(start_at) {
        const ptr0 = passArray8ToWasm0(start_at, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.verifydocumentquery_setStartAt(this.__wbg_ptr, ptr0, len0);
    }
}

const VerifyElementsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyelementsresult_free(ptr >>> 0, 1));

export class VerifyElementsResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyElementsResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyElementsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyElementsResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyelementsresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get elements() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyEpochInfosResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyepochinfosresult_free(ptr >>> 0, 1));

export class VerifyEpochInfosResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyEpochInfosResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyEpochInfosResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyEpochInfosResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyepochinfosresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get epoch_infos() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyEpochProposersResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyepochproposersresult_free(ptr >>> 0, 1));

export class VerifyEpochProposersResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyEpochProposersResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyEpochProposersResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyEpochProposersResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyepochproposersresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get proposers() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyFullIdentitiesByPublicKeyHashesResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyfullidentitiesbypublickeyhashesresult_free(ptr >>> 0, 1));

export class VerifyFullIdentitiesByPublicKeyHashesResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyFullIdentitiesByPublicKeyHashesResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyFullIdentitiesByPublicKeyHashesResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyFullIdentitiesByPublicKeyHashesResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyfullidentitiesbypublickeyhashesresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get identities() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyFullIdentityByIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyfullidentitybyidentityidresult_free(ptr >>> 0, 1));

export class VerifyFullIdentityByIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyFullIdentityByIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyFullIdentityByIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyFullIdentityByIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyfullidentitybyidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get identity() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyFullIdentityByNonUniquePublicKeyHashResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyfullidentitybynonuniquepublickeyhashresult_free(ptr >>> 0, 1));

export class VerifyFullIdentityByNonUniquePublicKeyHashResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyFullIdentityByNonUniquePublicKeyHashResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyFullIdentityByNonUniquePublicKeyHashResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyFullIdentityByNonUniquePublicKeyHashResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyfullidentitybynonuniquepublickeyhashresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get identity() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyFullIdentityByUniquePublicKeyHashResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyfullidentitybyuniquepublickeyhashresult_free(ptr >>> 0, 1));

export class VerifyFullIdentityByUniquePublicKeyHashResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyFullIdentityByUniquePublicKeyHashResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyFullIdentityByUniquePublicKeyHashResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyFullIdentityByUniquePublicKeyHashResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyfullidentitybyuniquepublickeyhashresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get identity() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyGroupInfoResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifygroupinforesult_free(ptr >>> 0, 1));

export class VerifyGroupInfoResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyGroupInfoResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyGroupInfoResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyGroupInfoResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifygroupinforesult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get group() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyGroupInfosInContractResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifygroupinfosincontractresult_free(ptr >>> 0, 1));

export class VerifyGroupInfosInContractResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyGroupInfosInContractResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyGroupInfosInContractResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyGroupInfosInContractResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifygroupinfosincontractresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get groups() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyIdentitiesContractKeysResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitiescontractkeysresult_free(ptr >>> 0, 1));

export class VerifyIdentitiesContractKeysResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentitiesContractKeysResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentitiesContractKeysResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentitiesContractKeysResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitiescontractkeysresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get keys() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyIdentityBalanceAndRevisionForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitybalanceandrevisionforidentityidresult_free(ptr >>> 0, 1));

export class VerifyIdentityBalanceAndRevisionForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityBalanceAndRevisionForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityBalanceAndRevisionForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityBalanceAndRevisionForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitybalanceandrevisionforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceandrevisionforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get balance() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceandrevisionforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @returns {bigint | undefined}
     */
    get revision() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceandrevisionforidentityidresult_revision(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityBalanceForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitybalanceforidentityidresult_free(ptr >>> 0, 1));

export class VerifyIdentityBalanceForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityBalanceForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityBalanceForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityBalanceForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitybalanceforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get balance() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityBalancesForIdentityIdsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitybalancesforidentityidsresult_free(ptr >>> 0, 1));

export class VerifyIdentityBalancesForIdentityIdsResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityBalancesForIdentityIdsResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityBalancesForIdentityIdsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityBalancesForIdentityIdsResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitybalancesforidentityidsresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get balances() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyIdentityContractNonceResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitycontractnonceresult_free(ptr >>> 0, 1));

export class VerifyIdentityContractNonceResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityContractNonceResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityContractNonceResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityContractNonceResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitycontractnonceresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get nonce() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityIdByNonUniquePublicKeyHashResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentityidbynonuniquepublickeyhashresult_free(ptr >>> 0, 1));

export class VerifyIdentityIdByNonUniquePublicKeyHashResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityIdByNonUniquePublicKeyHashResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityIdByNonUniquePublicKeyHashResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityIdByNonUniquePublicKeyHashResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentityidbynonuniquepublickeyhashresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentityidbynonuniquepublickeyhashresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    get identity_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentproofresult_documentSerialized(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityIdByUniquePublicKeyHashResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentityidbyuniquepublickeyhashresult_free(ptr >>> 0, 1));

export class VerifyIdentityIdByUniquePublicKeyHashResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityIdByUniquePublicKeyHashResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityIdByUniquePublicKeyHashResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityIdByUniquePublicKeyHashResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentityidbyuniquepublickeyhashresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentityidbynonuniquepublickeyhashresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    get identity_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentproofresult_documentSerialized(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityIdsByUniquePublicKeyHashesResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentityidsbyuniquepublickeyhashesresult_free(ptr >>> 0, 1));

export class VerifyIdentityIdsByUniquePublicKeyHashesResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityIdsByUniquePublicKeyHashesResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityIdsByUniquePublicKeyHashesResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityIdsByUniquePublicKeyHashesResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentityidsbyuniquepublickeyhashesresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get identity_ids() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyIdentityKeysByIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitykeysbyidentityidresult_free(ptr >>> 0, 1));

export class VerifyIdentityKeysByIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityKeysByIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityKeysByIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityKeysByIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitykeysbyidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get identity() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyIdentityNonceResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentitynonceresult_free(ptr >>> 0, 1));

export class VerifyIdentityNonceResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityNonceResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityNonceResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityNonceResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentitynonceresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get nonce() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityRevisionForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentityrevisionforidentityidresult_free(ptr >>> 0, 1));

export class VerifyIdentityRevisionForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityRevisionForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityRevisionForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityRevisionForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentityrevisionforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get revision() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyIdentityVotesGivenProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyidentityvotesgivenproofresult_free(ptr >>> 0, 1));

export class VerifyIdentityVotesGivenProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyIdentityVotesGivenProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyIdentityVotesGivenProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyIdentityVotesGivenProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyidentityvotesgivenproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get votes() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyMasternodeVoteResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifymasternodevoteresult_free(ptr >>> 0, 1));

export class VerifyMasternodeVoteResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyMasternodeVoteResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyMasternodeVoteResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyMasternodeVoteResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifymasternodevoteresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentityidbynonuniquepublickeyhashresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Uint8Array | undefined}
     */
    get vote() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.singledocumentproofresult_documentSerialized(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifySpecializedBalanceResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyspecializedbalanceresult_free(ptr >>> 0, 1));

export class VerifySpecializedBalanceResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifySpecializedBalanceResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifySpecializedBalanceResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifySpecializedBalanceResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyspecializedbalanceresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get balance() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyStartAtDocumentInProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifystartatdocumentinproofresult_free(ptr >>> 0, 1));

export class VerifyStartAtDocumentInProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyStartAtDocumentInProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyStartAtDocumentInProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyStartAtDocumentInProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifystartatdocumentinproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get document() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyStateTransitionWasExecutedWithProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifystatetransitionwasexecutedwithproofresult_free(ptr >>> 0, 1));

export class VerifyStateTransitionWasExecutedWithProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyStateTransitionWasExecutedWithProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyStateTransitionWasExecutedWithProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyStateTransitionWasExecutedWithProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifystatetransitionwasexecutedwithproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get proof_result() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenBalanceForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenbalanceforidentityidresult_free(ptr >>> 0, 1));

export class VerifyTokenBalanceForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenBalanceForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenBalanceForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenBalanceForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenbalanceforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyidentitybalanceforidentityidresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint | undefined}
     */
    get balance() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifyidentitybalanceforidentityidresult_balance(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r2 = getDataViewMemory0().getBigInt64(retptr + 8 * 1, true);
            return r0 === 0 ? undefined : BigInt.asUintN(64, r2);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VerifyTokenBalancesForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenbalancesforidentityidresult_free(ptr >>> 0, 1));

export class VerifyTokenBalancesForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenBalancesForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenBalancesForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenBalancesForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenbalancesforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get balances() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenBalancesForIdentityIdsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenbalancesforidentityidsresult_free(ptr >>> 0, 1));

export class VerifyTokenBalancesForIdentityIdsResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenBalancesForIdentityIdsResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenBalancesForIdentityIdsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenBalancesForIdentityIdsResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenbalancesforidentityidsresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get balances() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenContractInfoResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokencontractinforesult_free(ptr >>> 0, 1));

export class VerifyTokenContractInfoResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenContractInfoResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenContractInfoResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenContractInfoResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokencontractinforesult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get contract_info() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenDirectSellingPriceResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokendirectsellingpriceresult_free(ptr >>> 0, 1));

export class VerifyTokenDirectSellingPriceResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenDirectSellingPriceResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenDirectSellingPriceResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenDirectSellingPriceResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokendirectsellingpriceresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get price() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenDirectSellingPricesResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokendirectsellingpricesresult_free(ptr >>> 0, 1));

export class VerifyTokenDirectSellingPricesResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenDirectSellingPricesResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenDirectSellingPricesResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenDirectSellingPricesResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokendirectsellingpricesresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get prices() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenInfoForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokeninfoforidentityidresult_free(ptr >>> 0, 1));

export class VerifyTokenInfoForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenInfoForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenInfoForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenInfoForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokeninfoforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get token_info() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenInfosForIdentityIdResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokeninfosforidentityidresult_free(ptr >>> 0, 1));

export class VerifyTokenInfosForIdentityIdResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenInfosForIdentityIdResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenInfosForIdentityIdResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenInfosForIdentityIdResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokeninfosforidentityidresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get token_infos() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenInfosForIdentityIdsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokeninfosforidentityidsresult_free(ptr >>> 0, 1));

export class VerifyTokenInfosForIdentityIdsResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenInfosForIdentityIdsResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenInfosForIdentityIdsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenInfosForIdentityIdsResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokeninfosforidentityidsresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get token_infos() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenPerpetualDistributionLastPaidTimeResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenperpetualdistributionlastpaidtimeresult_free(ptr >>> 0, 1));

export class VerifyTokenPerpetualDistributionLastPaidTimeResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenPerpetualDistributionLastPaidTimeResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenPerpetualDistributionLastPaidTimeResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenPerpetualDistributionLastPaidTimeResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenperpetualdistributionlastpaidtimeresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get last_paid_time() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenPreProgrammedDistributionsResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenpreprogrammeddistributionsresult_free(ptr >>> 0, 1));

export class VerifyTokenPreProgrammedDistributionsResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenPreProgrammedDistributionsResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenPreProgrammedDistributionsResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenPreProgrammedDistributionsResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenpreprogrammeddistributionsresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get distributions() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenStatusResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenstatusresult_free(ptr >>> 0, 1));

export class VerifyTokenStatusResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenStatusResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenStatusResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenStatusResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenstatusresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get status() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenStatusesResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokenstatusesresult_free(ptr >>> 0, 1));

export class VerifyTokenStatusesResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenStatusesResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenStatusesResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenStatusesResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokenstatusesresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get statuses() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytokentotalsupplyandaggregatedidentitybalanceresult_free(ptr >>> 0, 1));

export class VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTokenTotalSupplyAndAggregatedIdentityBalanceResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytokentotalsupplyandaggregatedidentitybalanceresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get total_supply_and_balance() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyTotalCreditsInSystemResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifytotalcreditsinsystemresult_free(ptr >>> 0, 1));

export class VerifyTotalCreditsInSystemResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyTotalCreditsInSystemResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyTotalCreditsInSystemResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyTotalCreditsInSystemResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifytotalcreditsinsystemresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactionsignerstotalpowerresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {bigint}
     */
    get total_credits() {
        const ret = wasm.verifyactionsignerstotalpowerresult_total_power(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
}

const VerifyUpgradeStateResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyupgradestateresult_free(ptr >>> 0, 1));

export class VerifyUpgradeStateResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyUpgradeStateResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyUpgradeStateResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyUpgradeStateResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyupgradestateresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get upgrade_state() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyUpgradeVoteStatusResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyupgradevotestatusresult_free(ptr >>> 0, 1));

export class VerifyUpgradeVoteStatusResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyUpgradeVoteStatusResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyUpgradeVoteStatusResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyUpgradeVoteStatusResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyupgradevotestatusresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get vote_status() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyVotePollVoteStateProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyvotepollvotestateproofresult_free(ptr >>> 0, 1));

export class VerifyVotePollVoteStateProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyVotePollVoteStateProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyVotePollVoteStateProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyVotePollVoteStateProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyvotepollvotestateproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get result() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyVotePollVotesProofResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyvotepollvotesproofresult_free(ptr >>> 0, 1));

export class VerifyVotePollVotesProofResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyVotePollVotesProofResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyVotePollVotesProofResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyVotePollVotesProofResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyvotepollvotesproofresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifycontestsproofresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {Array<any>}
     */
    get votes() {
        const ret = wasm.verifycontestsproofresult_contests(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VerifyVotePollsEndDateQueryResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verifyvotepollsenddatequeryresult_free(ptr >>> 0, 1));

export class VerifyVotePollsEndDateQueryResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerifyVotePollsEndDateQueryResult.prototype);
        obj.__wbg_ptr = ptr;
        VerifyVotePollsEndDateQueryResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerifyVotePollsEndDateQueryResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifyvotepollsenddatequeryresult_free(ptr, 0);
    }
    /**
     * @returns {Uint8Array}
     */
    get root_hash() {
        const ret = wasm.verifyactioninfosincontractresult_root_hash(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * @returns {any}
     */
    get vote_polls() {
        const ret = wasm.verifyactioninfosincontractresult_actions(this.__wbg_ptr);
        return takeObject(ret);
    }
}

const VoteChoiceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_votechoice_free(ptr >>> 0, 1));
/**
 * Vote choice for masternode voting
 */
export class VoteChoice {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VoteChoice.prototype);
        obj.__wbg_ptr = ptr;
        VoteChoiceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VoteChoiceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_votechoice_free(ptr, 0);
    }
    /**
     * Create a yes vote
     * @param {string | null} [reason]
     * @returns {VoteChoice}
     */
    static yes(reason) {
        var ptr0 = isLikeNone(reason) ? 0 : passStringToWasm0(reason, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.votechoice_yes(ptr0, len0);
        return VoteChoice.__wrap(ret);
    }
    /**
     * Create a no vote
     * @param {string | null} [reason]
     * @returns {VoteChoice}
     */
    static no(reason) {
        var ptr0 = isLikeNone(reason) ? 0 : passStringToWasm0(reason, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.votechoice_no(ptr0, len0);
        return VoteChoice.__wrap(ret);
    }
    /**
     * Create an abstain vote
     * @param {string | null} [reason]
     * @returns {VoteChoice}
     */
    static abstain(reason) {
        var ptr0 = isLikeNone(reason) ? 0 : passStringToWasm0(reason, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.votechoice_abstain(ptr0, len0);
        return VoteChoice.__wrap(ret);
    }
    /**
     * Get vote type as string
     * @returns {string}
     */
    get voteType() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.votechoice_voteType(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get vote reason
     * @returns {string | undefined}
     */
    get reason() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.votechoice_reason(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VotePollFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_votepoll_free(ptr >>> 0, 1));
/**
 * Voting poll information
 */
export class VotePoll {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VotePoll.prototype);
        obj.__wbg_ptr = ptr;
        VotePollFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VotePollFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_votepoll_free(ptr, 0);
    }
    /**
     * Get poll ID
     * @returns {string}
     */
    get id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.votepoll_id(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get poll title
     * @returns {string}
     */
    get title() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.votepoll_title(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get poll description
     * @returns {string}
     */
    get description() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.votepoll_description(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get start time
     * @returns {bigint}
     */
    get startTime() {
        const ret = wasm.votepoll_startTime(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get end time
     * @returns {bigint}
     */
    get endTime() {
        const ret = wasm.votepoll_endTime(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Get vote options
     * @returns {Array<any>}
     */
    get voteOptions() {
        const ret = wasm.votepoll_voteOptions(this.__wbg_ptr);
        return takeObject(ret);
    }
    /**
     * Get required votes
     * @returns {number}
     */
    get requiredVotes() {
        const ret = wasm.votepoll_requiredVotes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get current votes
     * @returns {number}
     */
    get currentVotes() {
        const ret = wasm.votepoll_currentVotes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Check if poll is active
     * @returns {boolean}
     */
    isActive() {
        const ret = wasm.votepoll_isActive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get remaining time in milliseconds
     * @returns {bigint}
     */
    getRemainingTime() {
        const ret = wasm.votepoll_getRemainingTime(this.__wbg_ptr);
        return ret;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.votepoll_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const VoteResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_voteresult_free(ptr >>> 0, 1));
/**
 * Vote result information
 */
export class VoteResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VoteResult.prototype);
        obj.__wbg_ptr = ptr;
        VoteResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VoteResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_voteresult_free(ptr, 0);
    }
    /**
     * Get poll ID
     * @returns {string}
     */
    get pollId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.voteresult_pollId(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get yes votes
     * @returns {number}
     */
    get yesVotes() {
        const ret = wasm.voteresult_yesVotes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get no votes
     * @returns {number}
     */
    get noVotes() {
        const ret = wasm.voteresult_noVotes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get abstain votes
     * @returns {number}
     */
    get abstainVotes() {
        const ret = wasm.voteresult_abstainVotes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get total votes
     * @returns {number}
     */
    get totalVotes() {
        const ret = wasm.voteresult_totalVotes(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Check if vote passed
     * @returns {boolean}
     */
    get passed() {
        const ret = wasm.voteresult_passed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get vote percentage
     * @param {string} vote_type
     * @returns {number}
     */
    getPercentage(vote_type) {
        const ptr0 = passStringToWasm0(vote_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.voteresult_getPercentage(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Convert to JavaScript object
     * @returns {any}
     */
    toObject() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.voteresult_toObject(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const WasmCacheManagerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmcachemanager_free(ptr >>> 0, 1));
/**
 * WASM-exposed cache manager for the SDK
 */
export class WasmCacheManager {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmCacheManagerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmcachemanager_free(ptr, 0);
    }
    /**
     * Create a new cache manager with default TTLs and size limits
     */
    constructor() {
        const ret = wasm.wasmcachemanager_new();
        this.__wbg_ptr = ret >>> 0;
        WasmCacheManagerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set custom TTLs for each cache type
     * @param {number} contracts_ttl
     * @param {number} identities_ttl
     * @param {number} documents_ttl
     * @param {number} tokens_ttl
     * @param {number} quorum_keys_ttl
     * @param {number} metadata_ttl
     */
    setTTLs(contracts_ttl, identities_ttl, documents_ttl, tokens_ttl, quorum_keys_ttl, metadata_ttl) {
        wasm.wasmcachemanager_setTTLs(this.__wbg_ptr, contracts_ttl, identities_ttl, documents_ttl, tokens_ttl, quorum_keys_ttl, metadata_ttl);
    }
    /**
     * Set custom size limits for each cache type
     * @param {number} contracts_max
     * @param {number} identities_max
     * @param {number} documents_max
     * @param {number} tokens_max
     * @param {number} quorum_keys_max
     * @param {number} metadata_max
     */
    setMaxSizes(contracts_max, identities_max, documents_max, tokens_max, quorum_keys_max, metadata_max) {
        wasm.wasmcachemanager_setMaxSizes(this.__wbg_ptr, contracts_max, identities_max, documents_max, tokens_max, quorum_keys_max, metadata_max);
    }
    /**
     * Cache a data contract
     * @param {string} contract_id
     * @param {Uint8Array} contract_data
     */
    cacheContract(contract_id, contract_data) {
        const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(contract_data, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_cacheContract(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * Get a cached data contract
     * @param {string} contract_id
     * @returns {Uint8Array | undefined}
     */
    getCachedContract(contract_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(contract_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmcachemanager_getCachedContract(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Cache an identity
     * @param {string} identity_id
     * @param {Uint8Array} identity_data
     */
    cacheIdentity(identity_id, identity_data) {
        const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(identity_data, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_cacheIdentity(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * Get a cached identity
     * @param {string} identity_id
     * @returns {Uint8Array | undefined}
     */
    getCachedIdentity(identity_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmcachemanager_getCachedIdentity(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Cache a document
     * @param {string} document_key
     * @param {Uint8Array} document_data
     */
    cacheDocument(document_key, document_data) {
        const ptr0 = passStringToWasm0(document_key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(document_data, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_cacheDocument(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * Get a cached document
     * @param {string} document_key
     * @returns {Uint8Array | undefined}
     */
    getCachedDocument(document_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(document_key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmcachemanager_getCachedDocument(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Cache token information
     * @param {string} token_id
     * @param {Uint8Array} token_data
     */
    cacheToken(token_id, token_data) {
        const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(token_data, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_cacheToken(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * Get cached token information
     * @param {string} token_id
     * @returns {Uint8Array | undefined}
     */
    getCachedToken(token_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(token_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmcachemanager_getCachedToken(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Cache quorum keys
     * @param {number} epoch
     * @param {Uint8Array} keys_data
     */
    cacheQuorumKeys(epoch, keys_data) {
        const ptr0 = passArray8ToWasm0(keys_data, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_cacheQuorumKeys(this.__wbg_ptr, epoch, ptr0, len0);
    }
    /**
     * Get cached quorum keys
     * @param {number} epoch
     * @returns {Uint8Array | undefined}
     */
    getCachedQuorumKeys(epoch) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmcachemanager_getCachedQuorumKeys(retptr, this.__wbg_ptr, epoch);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Cache metadata
     * @param {string} key
     * @param {Uint8Array} metadata
     */
    cacheMetadata(key, metadata) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(metadata, wasm.__wbindgen_export_0);
        const len1 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_cacheMetadata(this.__wbg_ptr, ptr0, len0, ptr1, len1);
    }
    /**
     * Get cached metadata
     * @param {string} key
     * @returns {Uint8Array | undefined}
     */
    getCachedMetadata(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(key, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmcachemanager_getCachedMetadata(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_export_3(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Clear all caches
     */
    clearAll() {
        wasm.wasmcachemanager_clearAll(this.__wbg_ptr);
    }
    /**
     * Clear a specific cache type
     * @param {string} cache_type
     */
    clearCache(cache_type) {
        const ptr0 = passStringToWasm0(cache_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len0 = WASM_VECTOR_LEN;
        wasm.wasmcachemanager_clearCache(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Remove expired entries from all caches
     */
    cleanupExpired() {
        wasm.wasmcachemanager_cleanupExpired(this.__wbg_ptr);
    }
    /**
     * Get cache statistics
     * @returns {any}
     */
    getStats() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmcachemanager_getStats(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Start automatic cleanup with specified interval in milliseconds
     * @param {number} interval_ms
     */
    startAutoCleanup(interval_ms) {
        wasm.wasmcachemanager_startAutoCleanup(this.__wbg_ptr, interval_ms);
    }
    /**
     * Stop automatic cleanup
     */
    stopAutoCleanup() {
        wasm.wasmcachemanager_stopAutoCleanup(this.__wbg_ptr);
    }
}

const WasmContextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmcontext_free(ptr >>> 0, 1));

export class WasmContext {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmContextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmcontext_free(ptr, 0);
    }
}

const WasmErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmerror_free(ptr >>> 0, 1));

export class WasmError {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmerror_free(ptr, 0);
    }
    /**
     * Get the error category
     * @returns {ErrorCategory}
     */
    get category() {
        const ret = wasm.wasmerror_category(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the error message
     * @returns {string}
     */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmerror_message(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_export_3(deferred1_0, deferred1_1, 1);
        }
    }
}

const WasmSdkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmsdk_free(ptr >>> 0, 1));

export class WasmSdk {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmSdk.prototype);
        obj.__wbg_ptr = ptr;
        WasmSdkFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSdkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmsdk_free(ptr, 0);
    }
}

const WasmSdkBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmsdkbuilder_free(ptr >>> 0, 1));

export class WasmSdkBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmSdkBuilder.prototype);
        obj.__wbg_ptr = ptr;
        WasmSdkBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSdkBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmsdkbuilder_free(ptr, 0);
    }
    /**
     * @returns {WasmSdkBuilder}
     */
    static new_mainnet() {
        const ret = wasm.wasmsdkbuilder_new_mainnet();
        return WasmSdkBuilder.__wrap(ret);
    }
    /**
     * @returns {WasmSdkBuilder}
     */
    static new_testnet() {
        const ret = wasm.wasmsdkbuilder_new_mainnet();
        return WasmSdkBuilder.__wrap(ret);
    }
    /**
     * @returns {WasmSdk}
     */
    build() {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsdkbuilder_build(retptr, ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return WasmSdk.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * @param {WasmContext} context_provider
     * @returns {WasmSdkBuilder}
     */
    with_context_provider(context_provider) {
        const ptr = this.__destroy_into_raw();
        _assertClass(context_provider, WasmContext);
        var ptr0 = context_provider.__destroy_into_raw();
        const ret = wasm.wasmsdkbuilder_with_context_provider(ptr, ptr0);
        return WasmSdkBuilder.__wrap(ret);
    }
}

const WasmSignerFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmsigner_free(ptr >>> 0, 1));
/**
 * Signer interface for WASM
 */
export class WasmSigner {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmSignerFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmsigner_free(ptr, 0);
    }
    /**
     * Create a new signer
     */
    constructor() {
        const ret = wasm.wasmsigner_new();
        this.__wbg_ptr = ret >>> 0;
        WasmSignerFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set the identity ID for this signer
     * @param {string} identity_id
     */
    setIdentityId(identity_id) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(identity_id, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len0 = WASM_VECTOR_LEN;
            wasm.wasmsigner_setIdentityId(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Add a private key to the signer
     * @param {number} public_key_id
     * @param {Uint8Array} private_key
     * @param {string} key_type
     * @param {number} purpose
     */
    addPrivateKey(public_key_id, private_key, key_type, purpose) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(private_key, wasm.__wbindgen_export_0);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(key_type, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
            const len1 = WASM_VECTOR_LEN;
            wasm.wasmsigner_addPrivateKey(retptr, this.__wbg_ptr, public_key_id, ptr0, len0, ptr1, len1, purpose);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            if (r1) {
                throw takeObject(r0);
            }
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Remove a private key
     * @param {number} public_key_id
     * @returns {boolean}
     */
    removePrivateKey(public_key_id) {
        const ret = wasm.wasmsigner_removePrivateKey(this.__wbg_ptr, public_key_id);
        return ret !== 0;
    }
    /**
     * Sign data with a specific key
     * @param {Uint8Array} data
     * @param {number} public_key_id
     * @returns {Promise<Uint8Array>}
     */
    signData(data, public_key_id) {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_export_0);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmsigner_signData(this.__wbg_ptr, ptr0, len0, public_key_id);
        return takeObject(ret);
    }
    /**
     * Get the number of keys in the signer
     * @returns {number}
     */
    getKeyCount() {
        const ret = wasm.wasmsigner_getKeyCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Check if a key exists
     * @param {number} public_key_id
     * @returns {boolean}
     */
    hasKey(public_key_id) {
        const ret = wasm.wasmsigner_hasKey(this.__wbg_ptr, public_key_id);
        return ret !== 0;
    }
    /**
     * Get all key IDs
     * @returns {Uint32Array}
     */
    getKeyIds() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.wasmsigner_getKeyIds(retptr, this.__wbg_ptr);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var v1 = getArrayU32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_export_3(r0, r1 * 4, 4);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const WithdrawalOptionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_withdrawaloptions_free(ptr >>> 0, 1));
/**
 * Options for withdrawal operations
 */
export class WithdrawalOptions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WithdrawalOptions.prototype);
        obj.__wbg_ptr = ptr;
        WithdrawalOptionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WithdrawalOptionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_withdrawaloptions_free(ptr, 0);
    }
    constructor() {
        const ret = wasm.withdrawaloptions_new();
        this.__wbg_ptr = ret >>> 0;
        WithdrawalOptionsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Set the number of retries
     * @param {number} retries
     * @returns {WithdrawalOptions}
     */
    withRetries(retries) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.withdrawaloptions_withRetries(ptr, retries);
        return WithdrawalOptions.__wrap(ret);
    }
    /**
     * Set the timeout in milliseconds
     * @param {number} timeout_ms
     * @returns {WithdrawalOptions}
     */
    withTimeout(timeout_ms) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.withdrawaloptions_withTimeout(ptr, timeout_ms);
        return WithdrawalOptions.__wrap(ret);
    }
    /**
     * Set the fee multiplier
     * @param {number} multiplier
     * @returns {WithdrawalOptions}
     */
    withFeeMultiplier(multiplier) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.withdrawaloptions_withFeeMultiplier(ptr, multiplier);
        return WithdrawalOptions.__wrap(ret);
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
        const ret = String(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_abort_775ef1d17fc65868 = function(arg0) {
        getObject(arg0).abort();
    };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_clearInterval_ad2594253cc39c4b = function(arg0, arg1) {
        getObject(arg0).clearInterval(arg1);
    };
    imports.wbg.__wbg_clearInterval_dd1e598f425db353 = function(arg0) {
        const ret = clearInterval(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_clearTimeout_5a54f8841c30079a = function(arg0) {
        const ret = clearTimeout(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_clearTimeout_b2651b7485c58446 = function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    };
    imports.wbg.__wbg_close_2893b7d056a0627d = function() { return handleError(function (arg0) {
        getObject(arg0).close();
    }, arguments) };
    imports.wbg.__wbg_crypto_12576cd66246998b = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_crypto_574e78ad8b13b65f = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_data_432d9c3df2630942 = function(arg0) {
        const ret = getObject(arg0).data;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_datacontractwasm_new = function(arg0) {
        const ret = DataContractWasm.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_done_769e5ede4b31c67b = function(arg0) {
        const ret = getObject(arg0).done;
        return ret;
    };
    imports.wbg.__wbg_entries_3265d4158b33e5dc = function(arg0) {
        const ret = Object.entries(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_epoch_new = function(arg0) {
        const ret = Epoch.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_error_524f506f44df1645 = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_export_3(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_evonode_new = function(arg0) {
        const ret = Evonode.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetch_b7bf320f681242d2 = function(arg0, arg1) {
        const ret = getObject(arg0).fetch(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_fetchmanyresponse_new = function(arg0) {
        const ret = FetchManyResponse.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_from_2a5d3e218e67aa85 = function(arg0) {
        const ret = Array.from(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_generateKey_24819cf5d2ade0ec = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = getObject(arg0).generateKey(getObject(arg1), arg2 !== 0, getObject(arg3));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_38097e921c2494c3 = function() { return handleError(function (arg0, arg1) {
        globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_group_new = function(arg0) {
        const ret = Group.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_healthcheckresult_new = function(arg0) {
        const ret = HealthCheckResult.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_identitybalance_new = function(arg0) {
        const ret = IdentityBalance.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_identityinfo_new = function(arg0) {
        const ret = IdentityInfo.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_identityrevision_new = function(arg0) {
        const ret = IdentityRevision.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_identitywasm_new = function(arg0) {
        const ret = IdentityWasm.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_importKey_5fb87ea4f3fa3b17 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        const ret = getObject(arg0).importKey(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4), arg5 !== 0, getObject(arg6));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof ArrayBuffer;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_CryptoKey_63353526509ba4a2 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof CryptoKey;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Error_4d54113b22d20306 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Error;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Map_f3469ce2244d2430 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Map;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_7f2dcef8f78644a4 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Promise_935168b8f4b49db3 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Promise;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_f2cc20d9f7dfd644 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Response;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Uint8Array;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
        let result;
        try {
            result = getObject(arg0) instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
        const ret = Number.isSafeInteger(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_iterator_9a24c88df860dc65 = function() {
        const ret = Symbol.iterator;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_json_1671bfa3e3625686 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).json();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_keys_5c77a08ddc2fb8a6 = function(arg0) {
        const ret = Object.keys(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_log_c222819a41e063d3 = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_name_0b327d569f00ebee = function(arg0) {
        const ret = getObject(arg0).name;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_018dcc2d6c8c2f6a = function() { return handleError(function () {
        const ret = new Headers();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_23a2665fac83c611 = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_870(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            const ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_5e0be73521bc8c17 = function() {
        const ret = new Map();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_92c54fc74574ef55 = function() { return handleError(function (arg0, arg1) {
        const ret = new WebSocket(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_e25e5aab09ff45db = function() { return handleError(function () {
        const ret = new AbortController();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithstrandinit_06c535e0a867c635 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_next_25feadfc0913fea9 = function(arg0) {
        const ret = getObject(arg0).next;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).next();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_node_905d3e251edff8a2 = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_now_807e54c39636c349 = function() {
        const ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_of_2eaf5a02d443ef03 = function(arg0) {
        const ret = Array.of(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_of_4a05197bfc89556f = function(arg0, arg1, arg2) {
        const ret = Array.of(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_of_66b3ee656cbd962b = function(arg0, arg1) {
        const ret = Array.of(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_ok_3aaf32d069979723 = function(arg0) {
        const ret = getObject(arg0).ok;
        return ret;
    };
    imports.wbg.__wbg_parse_def2e24ef1252aff = function() { return handleError(function (arg0, arg1) {
        const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_prefundedbalance_new = function(arg0) {
        const ret = PrefundedBalance.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(getObject(arg0));
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = getObject(arg0).queueMicrotask;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).randomFillSync(takeObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_readyState_7ef6e63c349899ed = function(arg0) {
        const ret = getObject(arg0).readyState;
        return ret;
    };
    imports.wbg.__wbg_require_60cc747a6bc5215a = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_send_0293179ba074ffb4 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).send(getStringFromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_setInterval_cfbb32b46c873db2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).setInterval(getObject(arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setInterval_ed3b5e3c3ebb8a6d = function() { return handleError(function (arg0, arg1) {
        const ret = setInterval(getObject(arg0), arg1);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setTimeout_db2dbaeefb6f39c7 = function() { return handleError(function (arg0, arg1) {
        const ret = setTimeout(getObject(arg0), arg1);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_setTimeout_f2fe5af8e3debeb3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_11cd83f45504cedf = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
        getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_setbody_5923b78a95eedf29 = function(arg0, arg1) {
        getObject(arg0).body = getObject(arg1);
    };
    imports.wbg.__wbg_setheaders_834c0bdb6a8949ad = function(arg0, arg1) {
        getObject(arg0).headers = getObject(arg1);
    };
    imports.wbg.__wbg_setmethod_3c5280fe5d890842 = function(arg0, arg1, arg2) {
        getObject(arg0).method = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setonclose_14fc475a49d488fc = function(arg0, arg1) {
        getObject(arg0).onclose = getObject(arg1);
    };
    imports.wbg.__wbg_setonerror_8639efe354b947cd = function(arg0, arg1) {
        getObject(arg0).onerror = getObject(arg1);
    };
    imports.wbg.__wbg_setonmessage_6eccab530a8fb4c7 = function(arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    };
    imports.wbg.__wbg_setonopen_2da654e1f39745d5 = function(arg0, arg1) {
        getObject(arg0).onopen = getObject(arg1);
    };
    imports.wbg.__wbg_setsignal_75b21ef3a81de905 = function(arg0, arg1) {
        getObject(arg0).signal = getObject(arg1);
    };
    imports.wbg.__wbg_sign_163254c0ca9f0994 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = getObject(arg0).sign(getObject(arg1), getObject(arg2), getArrayU8FromWasm0(arg3, arg4));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_signal_aaf9ad74119f20a4 = function(arg0) {
        const ret = getObject(arg0).signal;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_statusText_207754230b39e67c = function(arg0, arg1) {
        const ret = getObject(arg1).statusText;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_status_f6360336ca686bf0 = function(arg0) {
        const ret = getObject(arg0).status;
        return ret;
    };
    imports.wbg.__wbg_stringify_f7ed6987935b4a24 = function() { return handleError(function (arg0) {
        const ret = JSON.stringify(getObject(arg0));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subtle_d0614193a0b7a626 = function(arg0) {
        const ret = getObject(arg0).subtle;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_text_7805bea50de2af49 = function() { return handleError(function (arg0) {
        const ret = getObject(arg0).text();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_toString_b46b28b849433558 = function(arg0) {
        const ret = getObject(arg0).toString();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_unshift_c290010f73f04fb1 = function(arg0, arg1) {
        const ret = getObject(arg0).unshift(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
        const ret = getObject(arg0).value;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_c01dfd4722a88165 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_votepoll_new = function(arg0) {
        const ret = VotePoll.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_voteresult_new = function(arg0) {
        const ret = VoteResult.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_as_number = function(arg0) {
        const ret = +getObject(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_bigint_from_i128 = function(arg0, arg1) {
        const ret = arg0 << BigInt(64) | BigInt.asUintN(64, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_i64 = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u128 = function(arg0, arg1) {
        const ret = BigInt.asUintN(64, arg0) << BigInt(64) | BigInt.asUintN(64, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_from_u64 = function(arg0) {
        const ret = BigInt.asUintN(64, arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
        const v = getObject(arg1);
        const ret = typeof(v) === 'bigint' ? v : undefined;
        getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper362 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 8, __wbg_adapter_62);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper364 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 8, __wbg_adapter_62);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper366 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 8, __wbg_adapter_62);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper368 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 14, __wbg_adapter_69);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper587 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 873, __wbg_adapter_72);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper7509 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 873, __wbg_adapter_62);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_error_new = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = getObject(arg0) in getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_is_array = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbindgen_is_bigint = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'bigint';
        return ret;
    };
    imports.wbg.__wbindgen_is_falsy = function(arg0) {
        const ret = !getObject(arg0);
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_jsval_eq = function(arg0, arg1) {
        const ret = getObject(arg0) === getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
        const ret = getObject(arg0) == getObject(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_export_0, wasm.__wbindgen_export_1);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_uint8_array_new = function(arg0, arg1) {
        var v0 = getArrayU8FromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_export_3(arg0, arg1 * 1, 1);
        const ret = v0;
        return addHeapObject(ret);
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('wasm_sdk_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
