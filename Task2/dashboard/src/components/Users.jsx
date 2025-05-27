import React, { useEffect, useState, useCallback, useRef } from "react";
import Card from "./Card";
import formatPhoneNumber from "../formatphoneNumber";

const Users = () => {
  const [user, setUser] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const fetchId = ++fetchIdRef.current;
      try {
        const response = await fetch(
          `http://localhost:5000/users?page=${currentPage}&limit=${pageSize}&search=${encodeURIComponent(
            debouncedSearch
          )}`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if (fetchId === fetchIdRef.current) {
          setUser(data.users);
          setTotalUsers(data.total);
        }
      } catch (error) {
        if (fetchId === fetchIdRef.current) {
          setUser([]);
          setTotalUsers(0);
          console.error("Error fetching user data:", error);
        }
      }
      if (fetchId === fetchIdRef.current) setLoading(false);
    };
    fetchUserData();
  }, [currentPage, pageSize, debouncedSearch]);

  const totalPages = Math.ceil(totalUsers / pageSize);

  const handlePageChange = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  const handlePageSizeChange = useCallback((e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  return (
    <>
      <div className="row mx-3 mb-4">
        <div className="col-6">
          <div className="d-flex align-items-center justify-content-start">
            <label className="fw-bold">Page size:</label>
            <select
              className="mx-2 px-4 py-1"
              aria-label="Default select example"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="10">10</option>
            </select>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex align-items-center justify-content-end">
            <label className="fw-bold mx-2">Search:</label>
            <input
              type="text"
              className="form-control w-50"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <div className="row mx-3">
        {loading ? (
          Array.from({ length: pageSize }).map((_, idx) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={idx}>
              <div className="card mt-2 h-100" aria-hidden="true">
                <div className="card-body">
                  <div className="mb-3">
                    <div
                      className="bg-secondary bg-opacity-25 rounded"
                      style={{ height: "20px", width: "60%" }}
                    ></div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="bg-secondary bg-opacity-25 rounded"
                      style={{ height: "16px", width: "80%" }}
                    ></div>
                  </div>
                  <div className="mb-3">
                    <div
                      className="bg-secondary bg-opacity-25 rounded"
                      style={{ height: "16px", width: "70%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : user.length > 0 ? (
          user.map((u) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={u.id}>
              <Card
                name={u.name}
                email={u.email}
                phone={formatPhoneNumber(u.phone)}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center text-muted py-5">
            No users found.
          </div>
        )}
      </div>
      <div className="d-flex justify-content-center mt-4">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            {[...Array(totalPages)].map((_, idx) => (
              <li
                className={`page-item${
                  currentPage === idx + 1 ? " active" : ""
                }`}
                key={idx}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item${
                currentPage === totalPages ? " disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Users;
