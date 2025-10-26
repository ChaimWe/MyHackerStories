import styles from "../styles/Item.module.css";
import type { Story } from "../types/Story.ts";
type ItemProps = Story & {
  onRemoveItem: (objectID: string) => void;
};  
const Item: React.FC<ItemProps> = ({
objectID, title, url, author, num_comments, points
, onRemoveItem}
) => {
  const handleRemoveItem = () => {
    onRemoveItem(objectID);
  };

  return (
    <div className={styles.item} onClick={()=>{window.open(url, 'blank')}}>
      <span style={{color:'#0000ff', textDecoration:'underline'}}>{title}</span>
      <span>{author}</span>
      <span>{num_comments} Comments</span>
      <span>{points} Points</span>
      <span>
        <button type="button" onClick={(e)=>{handleRemoveItem(); e.stopPropagation();}}>
          Remove Item
        </button>
      </span>
      &nbsp;
    </div>
  );
};
export default Item;
