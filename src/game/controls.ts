export enum KeyId {
  Up = 'key-up',
  // Down = 'key-down',
  Left = 'key-left',
  Right = 'key-right'
}

export interface KeyInfo {
  id: KeyId,
  name: string,
  key: string
}

export const inputKeys: Record<KeyId, KeyInfo> = {
  [KeyId.Up]: {
    id: KeyId.Up,
    name: 'Ship Thrust ⇈',
    key: 'ArrowUp'
  },
  [KeyId.Left]: {
    id: KeyId.Left,
    name: 'Rotate CCW ↺',
    key: 'ArrowLeft'
  },
  [KeyId.Right]: {
    id: KeyId.Right,
    name: 'Rotate CW ↻',
    key: 'ArrowRight'
  }
  // [KeyId.Down]: {
  //   id: KeyId.Down,
  //   name: 'Ship Reverse ⇊',
  //   key: 'ArrowDown'
  // }
}
