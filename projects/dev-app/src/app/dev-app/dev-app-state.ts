import { Direction } from '@angular/cdk/bidi';

const KEY = 'MTX_DEV_APP_STATE';

/** State of the appearance of the dev app. */
export interface DevAppState {
  density: string | number;
  animations: boolean;
  zoneless: boolean;
  darkTheme: boolean;
  systemTheme: boolean;
  rippleDisabled: boolean;
  strongFocusEnabled: boolean;
  m3Enabled: boolean;
  direction: Direction;
  colorApiBackCompat: boolean;
}

/** Gets the current appearance state of the dev app. */
export function getAppState(): DevAppState {
  let value: DevAppState | null = null;

  // Needs a try/catch since some browsers throw an error when accessing in incognito.
  try {
    const storageValue = localStorage.getItem(KEY);

    if (storageValue) {
      value = JSON.parse(storageValue);
    }
  } catch (e) {
    console.error(e);
  }

  if (!value) {
    value = {
      density: 0,
      animations: true,
      zoneless: false,
      darkTheme: false,
      systemTheme: false,
      rippleDisabled: false,
      strongFocusEnabled: false,
      m3Enabled: false,
      direction: 'ltr',
      colorApiBackCompat: true,
    };

    saveToStorage(value);
  }

  return value;
}

/** Saves the state of the dev app apperance in local storage. */
export function setAppState(newState: DevAppState): void {
  const currentState = getAppState();
  const keys = Object.keys(currentState) as (keyof DevAppState)[];

  // Only write to storage if something actually changed.
  for (const key of keys) {
    if (currentState[key] !== newState[key]) {
      saveToStorage(newState);
      break;
    }
  }
}

function saveToStorage(value: DevAppState): void {
  // Needs a try/catch since some browsers throw an error when accessing in incognito.
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}
