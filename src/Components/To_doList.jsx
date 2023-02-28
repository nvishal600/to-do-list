import React, { useState, useEffect, useRef } from 'react';
import List from './List';
import Swal from 'sweetalert2'

export default function To_doList() {

  const [text, textSet] = useState("");
  const inputHandle = (e) => {
    textSet(e.target.value);
  }

  const [list, setList] = useState(JSON.parse(localStorage.getItem('list')) ? JSON.parse(localStorage.getItem('list')): []);

  const updateListEnter = (e) => {
    if(text.trim() !== '' && e.which === 13){
      updateDoToList();
    }
  }

  const addList = (e) => {
    if(text.trim() !== '' ){
      updateDoToList();
    }
  }

  const updateDoToList = () => {
    setList((oldValue)=>{
      return [...oldValue, {"task": text, "done": false}];
    });
    textSet('');
  }

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const taskDoneHandle = (id) => {
    setList((oldValue)=>{
      oldValue.forEach((val, indx)=>{
        if(indx === id){
          val.done = true;
        }
      });
      return [...oldValue];
    });

    Toast.fire({
      icon: 'success',
      title: 'Your Task is Done'
    })
  }

  const taskDeleteHandle = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setList((oldValue)=>{
          return oldValue.filter((val, indx)=>{
            return indx !== id;
          })
        });
        Swal.fire(
          'Deleted!',
          'Your Task has been deleted.',
          'success'
        )
      }
    })
  }

  const taskViewHandle = (text) => {
    Swal.fire({
      title: 'Task',
      text: text,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
    })
  }

  const taskEditHandle = async(task, id) => {
    
    await Swal.fire({
      title: 'Edit Your Task',
      input: 'textarea',
      inputPlaceholder: 'Type your task here...',
      inputValue: task,
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          // console.log(Swal.getHtmlContainer().querySelector('#task').textContent);
          console.log(result.value);
          setList((oldValue)=>{
            oldValue.forEach((val, indx)=>{
              if(indx === id){
                val.task = result.value;
              }
            });
            return [...oldValue];
          });
          Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })

    // Swal.fire({
    //   title: 'Task',
    //   html: ` <textarea 
    //           rows="6" 
    //           cols="50"
    //           required: 'true'
    //           id="task"> ${task} </textarea>`,
    //   showCancelButton: true,
    //   showDenyButton: true,
    //   confirmButtonText: 'Save',
    //   denyButtonText: `Don't save`,
    // }).then((result) => {
      
    //   if (result.isConfirmed) {
    //     // console.log(Swal.getHtmlContainer().querySelector('#task').textContent);
    //     Swal.fire('Saved!', '', 'success');
    //   } else if (result.isDenied) {
    //     Swal.fire('Changes are not saved', '', 'info')
    //   }
    // })

  
  }

  //by default autofocus on input field
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  //list data store in localstorage
  useEffect(()=>{
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <>
      <div className='container-fluid'>
        <div className="body bg-info d-flex justify-content-center row" style={{height: "100vh"}} >
          <div className="todolist bg-light my-5 py-4  col-md-6" style={{ maxHeight: "90vh",  borderRadius: "5px", textAlign: "center"}}>
            <h3 className='text-center mb-3'>To-Do List</h3>
              <div className='d-flex justify-content-center' >
                <input ref={inputRef} placeholder='Enter Your Task' onKeyUp={updateListEnter} value={text} onChange={inputHandle} style={{width: "80%"}} type="text" className="form-control" />
                <button onClick={addList} style={{background: "green",border: "none", paddingBottom: "3px", borderRadius: "50%", marginLeft: "15px", width: "38px"}}> 
                  <span id="boot-icon" className="bi bi-plus" style={{fontSize:"1rem", color: "white"}}></span> 
                </button>
                <ul>
                </ul>
              </div>
              <div className="list mt-4" style={{textAlign: "left", height: "75%", overflowY: "auto"}}>
                <ul className='list-group'>
                  {list.map((val, index) => {
                    return (<List 
                    key={index} 
                    id={index} 
                    text={val.task} 
                    done={val.done} 
                    onSelect={taskDoneHandle}
                    deleteList={taskDeleteHandle}
                    taskView={taskViewHandle}
                    taskEdit={taskEditHandle}
                    />)
                  })}
                  
                </ul>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}
