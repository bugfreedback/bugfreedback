import { detectCaptureEnvironment } from "./detectCaptureEnvironment.js";
import { detectMobileDeviceProfile } from "./detectMobileDevice.js";
function androidFamilySteps(family, formFactor) {
  const gallery = "Open **Photos** or **Gallery**, find the screenshot, then return here and tap **Attach a screenshot**.";
  const powerVol = "Press and hold **Power** + **Volume Down** at the same time until the screen flashes or you hear a shutter sound.";
  switch (family) {
    case "samsung":
      return [
        powerVol,
        "On many Galaxy phones you can also swipe the edge of your hand across the screen (Palm swipe) when enabled in **Settings \u2192 Advanced features \u2192 Motions and gestures**.",
        "On Galaxy tablets, try **Power** + **Volume Down**, or a three-finger swipe if configured in settings.",
        gallery
      ];
    case "pixel":
      return [
        powerVol,
        "On Pixel 6 and later, you can briefly press **Power** + **Volume Up** to open the screenshot menu, then tap **Screenshot**.",
        "On Pixel Fold or Tablet, use **Power** + **Volume Down**.",
        gallery
      ];
    case "oneplus":
      return [
        powerVol,
        "On some OnePlus models, enable **Three-finger screenshot** in **Settings \u2192 Buttons & gestures** and swipe down with three fingers.",
        gallery
      ];
    case "xiaomi":
      return [
        powerVol,
        "On MIUI / HyperOS, a three-finger downward swipe may also capture the screen when enabled in **Settings \u2192 Additional settings \u2192 Button shortcuts**.",
        gallery
      ];
    case "huawei":
    case "honor":
      return [
        powerVol,
        "On some models, knock twice with a knuckle on the screen (Knuckle screenshot) when enabled in **Settings \u2192 Accessibility features**.",
        gallery
      ];
    case "motorola":
      return [
        powerVol,
        "On some Moto phones, a three-finger touch and hold captures the screen when enabled in **Moto gestures**.",
        gallery
      ];
    case "lg":
      return [
        powerVol,
        "On older LG phones, **Power** + **Volume Down** or **QuickMemo+** capture may apply depending on model.",
        gallery
      ];
    case "sony":
      return [
        powerVol,
        "On Xperia devices, **Power** + **Volume Down** is standard; some models support a **Screenshot** tile in the notification shade.",
        gallery
      ];
    case "oppo":
    case "realme":
      return [
        powerVol,
        "On ColorOS / Realme UI, try **Power** + **Volume Down**, or a three-finger swipe when enabled in **Special features \u2192 Gestures**.",
        gallery
      ];
    case "vivo":
      return [
        powerVol,
        "On Funtouch / OriginOS, **Power** + **Volume Down** is standard; some models support a three-finger swipe from settings.",
        gallery
      ];
    case "nokia":
      return [
        powerVol,
        "On Nokia Android phones, **Power** + **Volume Down** is the usual shortcut (Android One / stock Android).",
        gallery
      ];
    case "amazon":
      return [
        "On Fire tablets, press **Power** + **Volume Down** together, or use the system screenshot shortcut for your Fire OS version.",
        "Screenshots are saved under **Docs \u2192 Pictures \u2192 Screenshots** on many Fire devices.",
        gallery
      ];
    default:
      if (formFactor === "tablet") {
        return [
          powerVol,
          "Android tablets usually save screenshots to **Pictures/Screenshots** or **DCIM/Screenshots**.",
          gallery
        ];
      }
      return [
        powerVol,
        "Most Android phones since 2015 use **Power** + **Volume Down**; older models may use **Power** + **Home**.",
        gallery
      ];
  }
}
function iosSteps(profile) {
  const gallery = "Open the **Photos** app, select the screenshot, then return here and tap **Attach a screenshot**.";
  if (profile.iosHint === "ipad") {
    return [
      "Press **Top button** + **Volume Up** at the same time (Face ID iPad models).",
      "On iPad with a Home button, press **Home** + **Top/Power** button together.",
      "A thumbnail appears in the corner \u2014 you can dismiss it; the image is saved to Photos.",
      gallery
    ];
  }
  if (profile.iosHint === "ipod") {
    return [
      "Press **Power** + **Volume Up** at the same time.",
      gallery
    ];
  }
  return [
    "On iPhone with Face ID: press **Side button** + **Volume Up** together.",
    "On iPhone with a Home button: press **Home** + **Side/Top button** together.",
    "A thumbnail appears briefly; the screenshot is saved to **Photos**.",
    gallery
  ];
}
export function resolveScreenshotAttachHelp(userAgent, profile = detectMobileDeviceProfile(
  userAgent,
  detectCaptureEnvironment(userAgent).os
)) {
  if (profile.os === "ios") {
    return {
      heading: profile.formFactor === "tablet" ? "Take a screenshot on iPad" : "Take a screenshot on iPhone",
      steps: iosSteps(profile),
      note: "Browsers on iOS cannot capture the screen directly \u2014 take a system screenshot first, then attach it here."
    };
  }
  if (profile.os === "android") {
    const family = profile.androidFamily ?? "generic";
    const label = family === "generic" ? "Android" : family.charAt(0).toUpperCase() + family.slice(1);
    return {
      heading: profile.formFactor === "tablet" ? `Take a screenshot on your ${label} tablet` : `Take a screenshot on your ${label} phone`,
      steps: androidFamilySteps(family, profile.formFactor),
      note: "Mobile browsers cannot capture the tab directly \u2014 take a system screenshot first, then attach it here."
    };
  }
  return {
    heading: "Attach a screenshot",
    steps: [
      "Take a screenshot using your device's system shortcut.",
      "Return here and tap **Attach a screenshot** to select the image file."
    ]
  };
}
export function resolveScreenshotAttachHelpFromUserAgent(userAgent) {
  const env = detectCaptureEnvironment(userAgent);
  return resolveScreenshotAttachHelp(userAgent, detectMobileDeviceProfile(userAgent, env.os));
}
