import type { CaptureOs } from './detectCaptureEnvironment.js';
/** Major Android OEM families (UA sniffing; ~2015–present device lines). */
export type AndroidDeviceFamily = 'pixel' | 'samsung' | 'oneplus' | 'xiaomi' | 'huawei' | 'honor' | 'motorola' | 'lg' | 'sony' | 'oppo' | 'vivo' | 'realme' | 'nokia' | 'amazon' | 'generic';
export type MobileFormFactor = 'phone' | 'tablet' | 'unknown';
export type IosDeviceHint = 'iphone' | 'ipad' | 'ipod' | 'unknown';
export type MobileDeviceProfile = {
    os: CaptureOs;
    formFactor: MobileFormFactor;
    androidFamily?: AndroidDeviceFamily;
    iosHint?: IosDeviceHint;
};
export declare function detectAndroidDeviceFamily(userAgent: string): AndroidDeviceFamily;
export declare function detectMobileFormFactor(userAgent: string, os: CaptureOs): MobileFormFactor;
export declare function detectIosDeviceHint(userAgent: string): IosDeviceHint;
export declare function detectMobileDeviceProfile(userAgent: string, os: CaptureOs): MobileDeviceProfile;
