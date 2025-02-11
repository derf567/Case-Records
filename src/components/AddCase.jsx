import './css/AddCase.css';

const AddCase = () => {

    return (
        <div className="Case-Container">
            <div className="Case-Form">
                <h2>Add a case</h2>
                <div className="input">Title<input type="text" /></div>
                <div className="input">Nature of Claim<input type="text" /></div>

                <div className="datetime-container">
                    <div className="inputd"><label>Date Filed</label><input type="Date" /></div>
                    <div className="inputd"><label>Time</label><input type="Time" /></div>
                </div>

                <div className="input">Hearing<input type="text" /></div>
                <div className="input">Action Taken<input type="text" /></div>
                <div className="input">Judge Assigned<input type="text" /></div>
            </div>
        </div>
    );
};

export default AddCase;
