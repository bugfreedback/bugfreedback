type __VLS_Props = {
    imageDataUrl: string;
};
declare const _default: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    continue: (dataUrl: string) => any;
    cancel: () => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onContinue?: ((dataUrl: string) => any) | undefined;
    onCancel?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
