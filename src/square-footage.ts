export type RoomShape = 'rectangle' | 'square' | 'circle';

export interface SquareFootageRoom {
  shape: RoomShape;
  /** ft (imperial) or m (metric) */
  length?: number;
  width?: number;
  radius?: number;
}

export interface SquareFootageInput {
  rooms: SquareFootageRoom[];
  units: 'imperial' | 'metric';
}

export interface SquareFootageResult {
  totalAreaSqFt: number;
  totalAreaSqM: number;
  perRoom: number[];
}

/** Calculate total square footage for one or more rooms of various shapes. */
export function calculateSquareFootage(input: SquareFootageInput): SquareFootageResult {
  const { rooms, units } = input;

  const perRoom = rooms.map(room => {
    switch (room.shape) {
      case 'circle':
        return Math.PI * (room.radius ?? 0) ** 2;
      case 'square':
        return (room.width ?? 0) ** 2;
      case 'rectangle':
      default:
        return (room.length ?? 0) * (room.width ?? 0);
    }
  });

  const totalArea = perRoom.reduce((sum, a) => sum + a, 0);
  const totalAreaSqFt = units === 'metric' ? totalArea * 10.764 : totalArea;
  const totalAreaSqM = units === 'metric' ? totalArea : totalArea * 0.0929;

  return { totalAreaSqFt, totalAreaSqM, perRoom };
}
