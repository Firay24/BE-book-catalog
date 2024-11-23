import { Thickness } from '@prisma/client';
function DetermineThickness(totalPages: number): Thickness {
  if (totalPages <= 100) {
    return 'THIN';
  } else if (totalPages >= 101 && totalPages <= 200) {
    return 'NORMAL';
  } else {
    return 'THICK';
  }
}

export default DetermineThickness;
