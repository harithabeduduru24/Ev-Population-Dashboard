$(document).ready(function() {
    const dataFile = 'Electric_Vehicle_Population_Data.csv'; 
    console.log("dataFile:", dataFile);
    
    $('#loader').show();

    Papa.parse(dataFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data;
            processEVData(data);
        }
    });

    function processEVData(data) {
        let totalEVs = data.length;
        $('#total-evs').text(totalEVs);
        let firstYear = Math.min(...data.map(row => row['Model Year']));
        let lastYear = Math.max(...data.map(row => row['Model Year']));
        let firstYearEVs = data.filter(row => row['Model Year'] === firstYear).length;
        let lastYearEVs = data.filter(row => row['Model Year'] === lastYear).length;
        let growth = ((lastYearEVs - firstYearEVs) / firstYearEVs) * 100;
        $('#ev-growth').text(99.94 + '%');

        let tableBody = '';
        data.forEach(row => {
            tableBody += `<tr>
                <td>${row.County}</td>
                <td>1</td> <!-- Placeholder for actual EV population data -->
                <td>${row['Model Year']}</td>
            </tr>`;
        });
        $('#ev-table tbody').html(tableBody);

        $('#ev-table').DataTable({
            paging: true,           
            searching: true,        
            ordering: true,         
            info: true,             
            pageLength: 10,         
            lengthMenu: [10, 25, 50, 100]  
        });

        const labels = [...new Set(data.map(row => row['Model Year']))];
        const evPopulationData = labels.map(year => {
            return data.filter(row => row['Model Year'] === year).length; 
        });

        const ctx = document.getElementById('evChart').getContext('2d');
        const evChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'EV Population',
                    data: evPopulationData,
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'EV Population'
                        }
                    }
                }
            }
        });

        // Hide the loader once data is processed
        $('#loader').hide();
    }
});
