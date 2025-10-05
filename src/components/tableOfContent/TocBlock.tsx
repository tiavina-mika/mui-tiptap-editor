import { memo } from 'react';
import { ToC, type ToCItemType } from './ToC';
import { useCurrentEditor } from '@tiptap/react';
import { Typography } from '@mui/material';
import type { TextEditorProps } from '../../types';

const MemorizedToC = memo(ToC);

type Props = {
  tableOfContents: ToCItemType[];
  label: string | undefined;
  noContentLabel: string | undefined;
  position: TextEditorProps['tableOfContentPosition'];
};
const TocBlock = ({
  tableOfContents,
  label = 'Table of contents',
  noContentLabel,
  position,
}: Props) => {
  const { editor } = useCurrentEditor();

  return (
    <div className={`toc-sidebar-${position} toc-sidebar`}>
      <div className="toc-sidebar-options">
        <Typography className="toc-label">{label}</Typography>
        <div className="toc-items">
          <MemorizedToC
            editor={editor}
            items={tableOfContents}
            noContentLabel={noContentLabel}
          />
        </div>
      </div>
    </div>
  );
};

export default TocBlock;
