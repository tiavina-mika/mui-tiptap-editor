import Image from '@tiptap/extension-image'
import { NodeViewWrapper, NodeViewWrapperProps, ReactNodeViewRenderer } from '@tiptap/react';
import Edit from '../icons/Edit';
import { Typography } from '@mui/material';

const classes = {
  tiptapImageRoot: {
    width: 'fit-content',
    position: 'relative' as const,
  },
  editButton: {

  }
}
const getClassName = (selected: boolean): string => {
  // this className is used in the css file
  let className = 'tiptap-image';
  if (selected) {
    className += ' ProseMirror-selectednode';
  }
  return className
}

const ImageNode = (props: NodeViewWrapperProps) =>{
  const { updateAttributes } = props
  const { src, alt } = props.node.attrs

  const onEditAlt = () => {
    const newAlt = prompt('Set alt text:', alt || '')
    updateAttributes({alt: newAlt})
  }

  return (
    <NodeViewWrapper className={getClassName(props.selected)} data-drag-handle css={classes.tiptapImageRoot}>
      <img src={src} alt={alt} />
      <div className='alt-text-indicator'>
        <Typography>
          {alt ?
              <span className="symbol symbol-positive">✔</span> :
              <span className="symbol symbol-negative">!</span>
          }
          {alt ?
            <span className="text">{alt}</span>:
            <span className="text">Alt text missing.</span>
          }
          <button className="edit-button" type="button" onClick={onEditAlt}>
            <Edit />
          </button>
        </Typography>
      </div>
    </NodeViewWrapper>
  )
}

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNode)
  }
})

export default CustomImage;
