export declare namespace String {
    export declare function unicodeToChar(text: string): string;
    export declare function fragment(str: string, a: string, b: string, begin: boolean = true, end: boolean = true): string;
}

export declare namespace Files {
    export declare const paths: string;
}

export declare namespace Shell {
    export declare function exec(file: string, args: [], opts: {}): ChildProcessWithoutNullStreams;
    export declare function pause(): void;
}

export declare namespace Video {
    export declare namespace ffmpeg {
        export declare const path: string;
        export declare const outPath: string;
        export declare function exec(params: [], opts: {}): any;
    }
    export declare namespace m3u8 {
        export declare function download(url: string, opts: {}): ChildProcessWithoutNullStreams;
    }
}

export declare namespace Uri {
    export declare function getLastPartOf(uri: string): string;
    export declare function removeExtensionOf(uri: string): string;
}