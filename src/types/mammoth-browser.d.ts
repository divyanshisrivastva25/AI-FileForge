declare module "mammoth/mammoth.browser" {
  export interface MammothResult {
    value: string;
    messages: Array<{ type: string; message: string }>;
  }
  export function convertToHtml(
    input: { arrayBuffer: ArrayBuffer },
    options?: Record<string, unknown>,
  ): Promise<MammothResult>;
  const mammoth: { convertToHtml: typeof convertToHtml };
  export default mammoth;
}
