import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

const BusinessDashboard = () => {
    const { user, ads, createAd, navigateTo } = useUser();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [target, setTarget] = useState('all');

    if (user.membershipTier !== 'business') {
        return (
            <div>
                <h2>Access Denied</h2>
                <p>This area is for Business accounts only.</p>
                <button onClick={() => navigateTo('settings')}>Go to Settings to Switch Account</button>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createAd({ title, content, target });
        setTitle('');
        setContent('');
        setTarget('all');
    };

    return (
        <div>
            <h2>Business Dashboard 💼</h2>
            <p>Reach Delta State's Nursing Community.</p>

            <div style={{border: '1px solid #ccc', padding: '20px', borderRadius: '10px', backgroundColor: '#f9f9f9'}}>
                <h3>Create New Ad Campaign</h3>
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <div>
                        <label style={{display: 'block', marginBottom: '5px'}}>Ad Headline</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 50% Off Scrubs"
                            required
                            style={{width: '100%', padding: '8px'}}
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: '5px'}}>Ad Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Describe your offer..."
                            required
                            style={{width: '100%', padding: '8px', minHeight: '80px'}}
                        />
                    </div>
                    <div>
                        <label style={{display: 'block', marginBottom: '5px'}}>Target Audience</label>
                        <select
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            style={{width: '100%', padding: '8px'}}
                        >
                            <option value="all">All Users</option>
                            <option value="Year 1">Year 1 Students</option>
                            <option value="Year 2">Year 2 Students</option>
                            <option value="Graduates">Graduates</option>
                        </select>
                    </div>
                    <button type="submit" style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px', cursor: 'pointer', borderRadius: '5px'}}>
                        Launch Campaign 🚀
                    </button>
                </form>
            </div>

            <div style={{marginTop: '30px'}}>
                <h3>Your Active Ads</h3>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {ads.map(ad => (
                        <li key={ad.id} style={{borderBottom: '1px solid #eee', padding: '10px 0'}}>
                            <strong>{ad.title}</strong>
                            <p style={{margin: '5px 0', color: '#555'}}>{ad.content}</p>
                            <small>Target: {ad.target}</small>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BusinessDashboard;
