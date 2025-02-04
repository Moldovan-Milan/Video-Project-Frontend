import React from 'react'
import "./CommentTextBox.scss"

const CommentTextBox = () => {
  return (
    <div className="comm-tb-cont">
        <table className="comment-table">
            <tbody>
            <tr>
                <td className='td-comm-tb'><textarea className="tb-comm" placeholder="Write a comment... ✏"></textarea></td>
                <td className='btn-td'><button className='btn-send'>Send</button></td>
            </tr>
            </tbody>
        </table>

    </div>
  )

  function sendComment(){
    
  }
}

export default CommentTextBox