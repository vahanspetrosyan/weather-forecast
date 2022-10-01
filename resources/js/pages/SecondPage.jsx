import React,{ useState, useEffect} from 'react';
import Layout from "../components/Layout/Layout"

function SecondPage() {
    const  [] = useState([])

    useEffect(() => {
        getApi()
    }, [])

    const getApi = () => {
        axios.get('//api.openweathermap.org/data/2.5/forecast?q=yerevan&units=metric&appid=e4b8b08c185638b825af37facfe1fabb').then(function (response) {
            // handle success
            console.log(response);
        })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .finally(function () {
                // always executed
            });

    }

    return (
        <Layout>
            <div className="container">
                <h2 className="text-center mt-5 mb-3">This is second page</h2>
            </div>
        </Layout>
    );
}

export default SecondPage;
