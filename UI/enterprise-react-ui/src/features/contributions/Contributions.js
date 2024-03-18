import { useGetContributionsQuery } from "./contributionsApiSlice"
import { Link } from "react-router-dom";

const Contributions = () => {
    const {
        data: contributions,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetContributionsQuery()

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = (
            <section className="users">
                <h1>Users List</h1>
                <ul>
                    {contributions.map((contribution) => (
                        <li key={contribution.id}>
                            <h2>{contribution.title}</h2>
                            <p>{contribution.description}</p>
                            <p>Upload Date: {new Date(contribution.uploadDate).toLocaleDateString()}</p>
                            <a href={contribution.filePath} target="_blank" rel="noopener noreferrer">View Contribution</a>
                        </li>
                    ))}
                </ul>
                <Link to="/welcome">Back to Welcome</Link>
            </section>
        )
    } else if (isError) {
        content = (
        <><p>{JSON.stringify(error)}</p>
        <Link to="/welcome">Back to Welcome</Link></>
        );
    }

    return content
}
export default Contributions