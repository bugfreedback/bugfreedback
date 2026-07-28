function normalizeUa(userAgent) {
  return userAgent.toLowerCase();
}
export function detectAndroidDeviceFamily(userAgent) {
  const ua = normalizeUa(userAgent);
  if (/\(linux; android [^;]+; pixel\b| pixel \d|pixel tablet|pixel fold|nexus [5-9]|nexus 10/.test(ua)) {
    return "pixel";
  }
  if (/samsung|sm-[a-z0-9]|galaxy/.test(ua)) {
    return "samsung";
  }
  if (/oneplus|one plus|in20\d{2}|kb20\d{2}|le20\d{2}|gm19\d{2}|hd19\d{2}/.test(ua)) {
    return "oneplus";
  }
  if (/xiaomi|redmi|poco|mi \d|mi\d|mix \d|2201|2203|2301|2311|2401/.test(ua)) {
    return "xiaomi";
  }
  if (/huawei|hw-|mate \d|nova \d|lya-|ele-|ana-/.test(ua) && !/honor/.test(ua)) {
    return "huawei";
  }
  if (/honor|hry-|yal-|lra-/.test(ua)) {
    return "honor";
  }
  if (/motorola|moto[\s-]|xt\d{4}|mb5\d{2}/.test(ua)) {
    return "motorola";
  }
  if (/\blg[-\s]|lge[-\s]|lm-[a-z0-9]/.test(ua)) {
    return "lg";
  }
  if (/sony|xperia|so-\d{2}|sov\d{2}|sot\d{2}/.test(ua)) {
    return "sony";
  }
  if (/oppo|cph\d{4}|p[a-z]{2}m\d{2}|find x|reno\d/.test(ua)) {
    return "oppo";
  }
  if (/\bvivo\b|v\d{4}|iqoo|y\d{2}/.test(ua)) {
    return "vivo";
  }
  if (/realme|rmp\d{4}|rmx\d{4}/.test(ua)) {
    return "realme";
  }
  if (/nokia|ta-\d{4}/.test(ua)) {
    return "nokia";
  }
  if (/silk|kf[a-z0-9]|amazon/.test(ua)) {
    return "amazon";
  }
  return "generic";
}
export function detectMobileFormFactor(userAgent, os) {
  const ua = normalizeUa(userAgent);
  if (os === "ios") {
    if (/ipad/.test(ua)) {
      return "tablet";
    }
    if (/iphone|ipod/.test(ua)) {
      return "phone";
    }
    return "unknown";
  }
  if (os === "android") {
    if (/mobile/.test(ua)) {
      return "phone";
    }
    return "tablet";
  }
  return "unknown";
}
export function detectIosDeviceHint(userAgent) {
  const ua = normalizeUa(userAgent);
  if (/ipad/.test(ua)) {
    return "ipad";
  }
  if (/ipod/.test(ua)) {
    return "ipod";
  }
  if (/iphone/.test(ua)) {
    return "iphone";
  }
  return "unknown";
}
export function detectMobileDeviceProfile(userAgent, os) {
  const formFactor = detectMobileFormFactor(userAgent, os);
  if (os === "android") {
    return {
      os,
      formFactor,
      androidFamily: detectAndroidDeviceFamily(userAgent)
    };
  }
  if (os === "ios") {
    return {
      os,
      formFactor,
      iosHint: detectIosDeviceHint(userAgent)
    };
  }
  return { os, formFactor };
}
