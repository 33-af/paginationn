import "./App.css";
// import Dropdown from "./Dropdown/Dropdown";

import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";


function App() {
  const [items, setItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:3004/comments?_page=1&_limit=${limit}`);
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        const total = res.headers.get('x-total-count');
        console.log('Total count:', total);
        setPageCount(Math.ceil(total / limit));
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchComments();
  }, []);

  const fetchComments = async (currentPage) => {
    try {
      const res = await fetch(`http://localhost:3004/comments?_page=${currentPage}&_limit=${limit}`);
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      const total = res.headers.get('x-total-count');
      setPageCount(Math.ceil(total / limit));
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  };

  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    console.log('Selected page:', currentPage);
    const commentsFromServer = await fetchComments(currentPage);
    setItems(commentsFromServer);
  };

  return (
    <div className="container">
      <div className="row m-2">
        {items.map((item) => (
          <div key={item.id} className="col-sm-6 col-md-4 my-2">
            <div className="card shadow-sm w-100" style={{ minHeight: 225 }}>
              <div className="card-body">
                <h5 className="card-title text-center h2">Id: {item.id}</h5>
                <h6 className="card-subtitle mb-2 text-muted text-center">{item.email}</h6>
                <p className="card-text">{item.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ReactPaginate
        previousLabel="Previous"
        nextLabel="Next"
        breakLabel="..."
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName="pagination justify-content-center"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
  // return(

  //   <Dropdown/>
  // )
 
}

export default App;