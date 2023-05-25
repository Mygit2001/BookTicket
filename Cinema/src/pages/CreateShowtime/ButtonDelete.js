import React from 'react'

import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Tooltip from '@material-ui/core/Tooltip';


export default function ButtonDelete() {
  return (
    <>
      <Tooltip title={ "Xóa"}>
        <IconButton color="#ccc" style={{ }} >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
    </>

  )
}
