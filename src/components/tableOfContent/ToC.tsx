import { Link, Typography } from '@mui/material';
import { TextSelection } from '@tiptap/pm/state';
import { Editor } from '@tiptap/react';
import { type CSSProperties, type MouseEvent } from 'react';

export type ToCItemType = {
  id: string;
  textContent: string;
  level: number;
  isActive?: boolean;
  isScrolledOver?: boolean;
  itemIndex?: number;
};


type ToCItemProps = {
  item: ToCItemType;
  onItemClick: (e: MouseEvent<HTMLAnchorElement>, id: string) => void;
  index?: number;
};

export const ToCItem = ({ item, onItemClick }: ToCItemProps) => {
  return (
    <div
      className={`${item.isActive && !item.isScrolledOver ? 'is-active' : ''} ${item.isScrolledOver ? 'is-scrolled-over' : ''}`}
      style={
        {
          '--level': item.level,
        } as CSSProperties
      }
    >
      <Link
        data-item-index={item.itemIndex}
        href={`#${item.id}`}
        underline="none"
        onClick={e => onItemClick(e, item.id)}
      >
        {item.textContent}
      </Link>
    </div>
  );
};

export const ToCEmptyState = ({ label }: { label: string | undefined }) => {
  return (
    <div className="toc-empty-state">
      <Typography>{label}</Typography>
    </div>
  );
};

type ToCProps = {
  items?: ToCItemType[];
  editor?: Editor | null;
  noContentLabel?: string;
};

export const ToC = ({ items = [], editor, noContentLabel }: ToCProps) => {
  if (items.length === 0) {
    return <ToCEmptyState label={noContentLabel} />;
  }

  const onItemClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"]`);

      if (!element) return;

      const pos = editor.view.posAtDOM(element, 0);

      // set focus
      const tr = editor.view.state.tr;

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)));

      editor.view.dispatch(tr);

      editor.view.focus();

      if (history.pushState) {
        history.pushState(null, '', `#${id}`);
      }

      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      {items.map((item, i) => (
        <ToCItem
          key={item.id}
          index={i + 1}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </>
  );
};
