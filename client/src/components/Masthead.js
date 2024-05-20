import React from 'react';

const Masthead = () => {
    return (
        <section className="masthead video" id="masthead" style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
            <video style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: -1
            }} autoPlay muted loop playsInline>
                <source src="https://www.dqecom.com/wp-content/uploads/2021/09/Dqe-Home-092021-1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </section>
    );
};

export default Masthead;