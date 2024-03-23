import React from 'react';
import { useGetClosureDateByIdQuery } from '~/feature/closureDates/dateApiSlice';
import { useGetAllMagazineQuery } from '~/feature/magazine/magazineApiSlice';

import './Contributions.css';

const Contribution = () => {
    const {
        data: closureDate,
        isLoading: closureDateLoading,
        error: closureDateError,
    } = useGetClosureDateByIdQuery(1);

    const {
        data: magazines,
        isLoading: magazinesLoading,
        error: magazinesError,
    } = useGetAllMagazineQuery();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    return (
        <div className="contributions">
            <div className="button row">
                <a className="btn col-sm" role="button" href="/contribution">
                    Upload articles
                </a>
                <a className="btn col-sm" role="button" href="/contribution">
                    View recent uploads
                </a>
            </div>
            <form>
                <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input type="text" className="form-control" name="title" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea className="form-control" name="description" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload File:</label>
                    <input type="file" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Upload Image:</label>
                    <input type="file" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Submission date :</label>
                    {/* Assuming you want to display the first closure date */}
                    {closureDateLoading ? (
                        <span>Loading...</span>
                    ) : closureDateError ? (
                        <span>Error loading submission data.</span>
                    ) : (
                        <span>{formatDate(closureDate.closureDate)}</span>
                    )}
                </div>
                <div className="mb-3">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                    >
                        <option selected>Select magazine</option>
                        {magazinesLoading ? (
                            <option>Loading...</option>
                        ) : magazinesError ? (
                            <option>Error loading magazines.</option>
                        ) : (
                            magazines.map((magazine) => (
                                <option key={magazine.id} value={magazine.id}>
                                    {magazine.title}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <div className="form-check">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                    />
                    <label
                        className="form-check-label"
                        htmlFor="flexCheckDefault"
                    >
                        I have read and agree to the terms and conditions
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Contribution;
