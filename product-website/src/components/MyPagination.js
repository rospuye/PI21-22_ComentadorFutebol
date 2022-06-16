import React from 'react'

// CSS
import '../components/css/style.css'

function MyPagination({ n_pages, selPage, setSelPage, ellipsis_distance }) {

    return (
        <>
            <div className="pagination" style={{ display: "flex", justifyContent: "center" }}>
                {selPage/1 > 1 &&
                    <a onClick={() => setSelPage(selPage/1 - 1)}>&laquo;</a>
                }

                {[
                    ...Array(n_pages),
                ].map((value, idx) => (
                    <a value={idx+1} id={"page" + (idx + 1)} key={idx} onClick={(e) => { setSelPage(e.target.innerText) }}>{idx + 1}</a>
                ))}
                {selPage/1 < n_pages &&
                    <a onClick={() => setSelPage(selPage/1 + 1)}>&raquo;</a>
                }
            </div>
        </>
    )
}

export default MyPagination