import type { ReactiveController, ReactiveControllerHost } from "lit";

/**
 * Reactive controller that tracks whether named/default slots have content.
 *
 * Usage:
 *   private readonly hasSlot = new HasSlotController(this, "[default]");
 *   // then in render():
 *   this.hasSlot.test("[default]") // → boolean
 */
export class HasSlotController implements ReactiveController {
  host: ReactiveControllerHost & Element;
  slotNames: string[] = [];

  constructor(host: ReactiveControllerHost & Element, ...slotNames: string[]) {
    (this.host = host).addController(this);
    this.slotNames = slotNames;
  }

  private hasDefaultSlot(): boolean {
    return [...this.host.childNodes].some((node) => {
      if (node.nodeType === node.TEXT_NODE && node.textContent?.trim() !== "") {
        return true;
      }
      if (node.nodeType === node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        if (!el.hasAttribute("slot")) {
          return true;
        }
      }
      return false;
    });
  }

  private hasNamedSlot(name: string): boolean {
    return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
  }

  /** Test whether a slot has content. Use `"[default]"` for the default slot. */
  test(slotName: string): boolean {
    return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
  }

  hostConnected(): void {
    this.host.shadowRoot?.addEventListener("slotchange", this.handleSlotChange);
  }

  hostDisconnected(): void {
    this.host.shadowRoot?.removeEventListener("slotchange", this.handleSlotChange);
  }

  private handleSlotChange = (event: Event): void => {
    const slot = event.target as HTMLSlotElement;
    if (
      (this.slotNames.includes("[default]") && !slot.name) ||
      (slot.name && this.slotNames.includes(slot.name))
    ) {
      this.host.requestUpdate();
    }
  };
}
