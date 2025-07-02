/**
 * Bluetooth Web API TypeScript declarations
 * 
 * These types are for the Web Bluetooth API used in browser environments.
 * They may not be available in all browsers or environments.
 */

declare global {
  interface Navigator {
    bluetooth?: Bluetooth;
  }

  interface Bluetooth {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
    getAvailability(): Promise<boolean>;
    addEventListener(type: 'availabilitychanged', listener: (event: Event) => void): void;
    removeEventListener(type: 'availabilitychanged', listener: (event: Event) => void): void;
  }

  interface RequestDeviceOptions {
    filters?: BluetoothScanFilter[];
    optionalServices?: BluetoothServiceUUID[];
    acceptAllDevices?: boolean;
  }

  interface BluetoothScanFilter {
    services?: BluetoothServiceUUID[];
    name?: string;
    namePrefix?: string;
    manufacturerData?: Map<number, ArrayBuffer>;
    serviceData?: Map<BluetoothServiceUUID, ArrayBuffer>;
  }

  interface BluetoothDevice extends EventTarget {
    readonly id: string;
    readonly name?: string;
    readonly gatt?: BluetoothRemoteGATTServer;
    readonly uuids?: BluetoothServiceUUID[];
    watchAdvertisements(): Promise<void>;
    unwatchAdvertisements(): void;
    addEventListener(type: 'advertisementreceived', listener: (event: BluetoothAdvertisingEvent) => void): void;
    addEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void;
    removeEventListener(type: 'advertisementreceived', listener: (event: BluetoothAdvertisingEvent) => void): void;
    removeEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void;
  }

  interface BluetoothRemoteGATTServer {
    readonly device: BluetoothDevice;
    readonly connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
    getPrimaryServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
  }

  interface BluetoothRemoteGATTService extends EventTarget {
    readonly device: BluetoothDevice;
    readonly uuid: string;
    readonly isPrimary: boolean;
    getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
    getCharacteristics(characteristic?: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic[]>;
    getIncludedService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
    getIncludedServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
    addEventListener(type: 'serviceadded', listener: (event: Event) => void): void;
    addEventListener(type: 'servicechanged', listener: (event: Event) => void): void;
    addEventListener(type: 'serviceremoved', listener: (event: Event) => void): void;
    removeEventListener(type: 'serviceadded', listener: (event: Event) => void): void;
    removeEventListener(type: 'servicechanged', listener: (event: Event) => void): void;
    removeEventListener(type: 'serviceremoved', listener: (event: Event) => void): void;
  }

  interface BluetoothRemoteGATTCharacteristic extends EventTarget {
    readonly service: BluetoothRemoteGATTService;
    readonly uuid: string;
    readonly properties: BluetoothCharacteristicProperties;
    readonly value?: DataView;
    getDescriptor(descriptor: BluetoothDescriptorUUID): Promise<BluetoothRemoteGATTDescriptor>;
    getDescriptors(descriptor?: BluetoothDescriptorUUID): Promise<BluetoothRemoteGATTDescriptor[]>;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
    writeValueWithResponse(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
    removeEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
  }

  interface BluetoothCharacteristicProperties {
    readonly authenticatedSignedWrites: boolean;
    readonly broadcast: boolean;
    readonly indicate: boolean;
    readonly notify: boolean;
    readonly read: boolean;
    readonly reliableWrite: boolean;
    readonly writableAuxiliaries: boolean;
    readonly write: boolean;
    readonly writeWithoutResponse: boolean;
  }

  interface BluetoothRemoteGATTDescriptor {
    readonly characteristic: BluetoothRemoteGATTCharacteristic;
    readonly uuid: string;
    readonly value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
  }

  interface BluetoothAdvertisingEvent extends Event {
    readonly device: BluetoothDevice;
    readonly uuids: BluetoothServiceUUID[];
    readonly name?: string;
    readonly appearance?: number;
    readonly txPower?: number;
    readonly rssi?: number;
    readonly manufacturerData: Map<number, ArrayBuffer>;
    readonly serviceData: Map<BluetoothServiceUUID, ArrayBuffer>;
  }

  type BluetoothServiceUUID = number | string;
  type BluetoothCharacteristicUUID = number | string;
  type BluetoothDescriptorUUID = number | string;
}

export {};