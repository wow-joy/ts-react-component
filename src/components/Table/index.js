import Table from './Table';
import Hoc from '../../tools/Hoc';
import type1 from "./types/type1";

export const Type1 = Hoc(type1)(Table);
export default Table