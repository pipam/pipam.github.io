// Type definitions for sniffr v1.1.4
// Project: https://github.com/antivanov/sniffr
// Definitions by: facekapow <https://github.com/facekapow>

declare module 'sniffr' {
  interface SniffrProperty {
    name?: string;
    version: number[];
    versionString: string;
  }

  class Sniffr {
    browser: SniffrProperty;
    os: SniffrProperty;
    device: SniffrProperty;

    sniff(userAgent: string): void;
  }

  export = Sniffr;
}