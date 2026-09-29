/**
 * UI controller for the interaction prompt.
 * Shows "Press E to talk" when near a character.
 */
export class Prompt {
  private element: HTMLElement;
  private currentCharacterName: string = '';

  constructor() {
    this.element = document.getElementById('prompt')!;
  }

  show(characterName: string): void {
    if (this.currentCharacterName !== characterName) {
      this.currentCharacterName = characterName;
      this.element.innerHTML = `Press <kbd>E</kbd> to talk to <strong>${characterName}</strong>`;
    }
    this.element.style.display = 'block';
  }

  hide(): void {
    this.element.style.display = 'none';
    this.currentCharacterName = '';
  }
}
