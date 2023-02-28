import React from 'react'

export default function List(props) {
  let lineThrough = props.done ? "line-through" : "";
  let disable = props.done ? true : false;  
  let noDrop = props.done ? 'no-drop' : '';
  let taskColor = props.done ? 'red' : 'black'
  return (
    <>
        <li style={{textDecoration: lineThrough, color: taskColor }} className='list-group-item list-group-item-primary d-flex justify-content-between'>
          {props.text.length > 42 ? <><span>{props.text.slice(0, 42)+' ...'}<button onClick={()=>props.taskView(props.text)} style={{    border: "none", background: "transparent",  padding: "0", color: 'blue'}} >Read More</button></span></> : props.text}
            <div>
                {props.done ? '' : <button disabled={disable} onClick={()=>props.onSelect(props.id)} style={{background: "#18A558", border: "none", cursor: noDrop}} className="badge mx-2"><i className="bi bi-check2-square"></i> </button>}
                {props.done ? '' : <button onClick={()=>props.taskEdit(props.text, props.id)} style={{background: "#18A558", border: "none"}} className="badge mx-2"><i className="bi bi-pencil-square"></i></button>}
                <button onClick={() => {
                    props.deleteList(props.id)
                }} style={{background: "red", border: "none"}} className="badge"><i className="bi bi-trash"></i> </button>
            </div>
        </li>
    </>
  )
}
