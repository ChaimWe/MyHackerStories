import React from "react";
import Item from "./Item.tsx";
import type { Story } from "../types/Story.ts";


interface ListProps {
  list: Story[];
  onRemoveItem: (objectID: string) => void;
}
const List: React.FC<ListProps> = React.memo(({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} {...item} onRemoveItem={onRemoveItem} />
  )));

export default List;
