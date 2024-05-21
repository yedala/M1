import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getTask, updateTask } from '../../services/apiTask';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateLoader } from '../../utils/userSlice';



const EditTask = () => {
  const location = useLocation();
  const data = location.state;
  const title = useRef();
  const content = useRef();
  const status = useRef();
  const [task, setTask] = useState();
  const navigate = useNavigate();
  const token = useSelector(state => state?.user?.userData?.token);
  const dispatch = useDispatch();




  const fetchTaskData = async () => {
    const getData = await getTask(data.token, data.id);
    if (getData) {
      setTask(getData?.data);
    }
    dispatch(updateLoader(false));
  }

  useEffect(() => {
    dispatch(updateLoader(true));
    fetchTaskData();

  }, [data])
  const handleCancel = () => {
    navigate('/home');
  }
  const handleSave = async () => {
    dispatch(updateLoader(true));
    const payload = {
      title: title.current.value,
      content: content.current.value,
      status: status.current.value,
    }
    try {
      const updatedTask = await updateTask(token, data.id, payload);
      if (updateTask) {
        navigate('/home');
        dispatch(updateLoader(false));
      }

    } catch (err) {
      dispatch(updateLoader(false));
      navigate('/home');
    }

  }
  return (
    <div className='  w-screen h-screen absolute bg-blue-100 '>
      <h1 className=' text-3xl flex justify-center p-3'>Edit Task</h1>

      <div className='p-9 flex flex-col justify-center items-center'>

        <input ref={title} defaultValue={task?.title} type="text" className='w-4/5 p-3 mx-7 my-5 rounded-md' placeholder='Enter Title' />
        <textarea ref={content} defaultValue={task?.content} className='w-4/5 h-auto p-3 mx-7 my-5 rounded-md' placeholder='Enter Description '></textarea>
        <select ref={status} name="status" value={task?.status} placeholder="Status" className='w-4/5 p-3 mx-7 my-5 rounded-md'>
          <option value="ToDo" >To Do</option>
          <option value="InProgress">In Progress</option>
          <option value="Done" >Done</option>
        </select>
        <div className=' w-4/5 flex justify-end'>
          <button className='p-2 font-bold rounded-lg px-4 my-10 mx-5 bg-red-400' onClick={handleCancel}>Cancel</button>
          <button className='p-2 font-bold rounded-lg px-4 my-10 bg-green-400' onClick={handleSave}>Save</button>
        </div>
      </div>

    </div>
  )
}

export default EditTask