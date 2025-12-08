
import React, { useEffect, useState, useMemo } from "react";
import Banner from "../../components/Banner";
import Card from "../../components/Card";
import Jobs from "./Jobs";
import Sidebar from "../../sidebar/Sidebar";
import Newsletter from "../../components/Newsletter";
import JobDetailsModal from "../../components/JobDetailsModal";

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedJob, setSelectedJob] = useState(null);
  
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch("http://localhost:3000/all-jobs") // REVERTED: Pointing back to the server
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
        console.error("Error fetching job data:", err);
      });
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };
  
  const handleDetailsClick = (job) => {
    setSelectedJob(job);
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    if (query) {
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (selectedCategory) {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // All filtering logic is now case-insensitive
        filtered = filtered.filter(job => {
            const category = selectedCategory.toLowerCase();
            const jobLocation = job.jobLocation.toLowerCase();
            const experienceLevel = job.experienceLevel.toLowerCase();
            const employmentType = job.employmentType.toLowerCase();
            const salaryType = job.salaryType.toLowerCase();
            const postingDate = new Date(job.postingDate);

            if (category === jobLocation) return true;
            if (category === experienceLevel) return true;
            if (category === employmentType) return true;
            if (category === salaryType) return true;

            // Salary filtering
            if(!isNaN(parseInt(category)) && parseInt(job.maxPrice) <= parseInt(category)) return true;
            
            // Date filtering
            if (category === "last 24 hours" && postingDate >= twentyFourHoursAgo) return true;
            if (category === "last 7 days" && postingDate >= sevenDaysAgo) return true;
            if (category === "last 30 days" && postingDate >= thirtyDaysAgo) return true;

            return false;
        });
    }

    if (sortOption === 'newest') {
      filtered.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
    } else if (sortOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.postingDate) - new Date(b.postingDate));
    }

    return filtered;
  }, [jobs, query, selectedCategory, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);
  const paginatedJobs = filteredAndSortedJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const nextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const prevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const result = paginatedJobs.map((data, i) => <Card key={i} data={data} onDetailsClick={handleDetailsClick} />);

  const renderContent = () => {
    if (isLoading) return <p className="font-medium">Loading...</p>;
    if (error) return <p className="font-medium text-red-500">Error: {error}. Could not load job data.</p>;
    if (filteredAndSortedJobs.length > 0) {
        return (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{filteredAndSortedJobs.length} Jobs Found</h3>
                <div className="flex items-center gap-2">
                  <label className="font-semibold">Sort by:</label>
                  <select onChange={handleSortChange} value={sortOption} className='bg-white border p-2 rounded'>
                    <option value="">Default</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
              <Jobs result={result} />
            </>
        )
    }
    return (
        <>
            <h3 className="text-lg font-bold mb-2">0 Jobs Found</h3>
            <p>No jobs match the selected filters.</p>
        </>
    );
  }

  return (
    <div>
      <Banner query={query} handleInputChange={handleInputChange} />
      <JobDetailsModal job={selectedJob} onClose={handleCloseModal} />
      <div className="bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        <div className="bg-white p-4 rounded"><Sidebar handleChange={handleChange} handleClick={handleClick} /></div>
        <div className="col-span-2 bg-white p-4 rounded-sm">{renderContent()}</div>
        <div className="bg-white p-4 rounded"><Newsletter /></div>
      </div>
      {totalPages > 1 && (
            <div className="flex justify-center mb-8 space-x-8">
              <button onClick={prevPage} disabled={currentPage === 1} className="hover:underline font-bold">Previous</button>
              <span className="mx-2">Page {currentPage} of {totalPages}</span>
              <button onClick={nextPage} disabled={currentPage === totalPages} className="hover:underline font-bold">Next</button>
            </div>
      )}
    </div>
  );
};

export default Home;
