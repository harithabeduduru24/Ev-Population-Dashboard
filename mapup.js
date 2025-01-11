$(document).ready(function() {
    const dataFile = 'Electric_Vehicle_Population_Data.csv';  // Correct path to your CSV dataset file
    console.log("dataFile:", dataFile);
    
    // Show the loader when data is being fetched
    $('#loader').show();

    // Load the data
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
        // 1. Calculate Total EVs
        let totalEVs = data.length;
        $('#total-evs').text(totalEVs);

        // 2. Calculate EV Growth (using a basic formula here for illustration)
        let firstYear = Math.min(...data.map(row => row['Model Year']));
        let lastYear = Math.max(...data.map(row => row['Model Year']));
        let firstYearEVs = data.filter(row => row['Model Year'] === firstYear).length;
        let lastYearEVs = data.filter(row => row['Model Year'] === lastYear).length;
        let growth = ((lastYearEVs - firstYearEVs) / firstYearEVs) * 100;
        $('#ev-growth').text(growth.toFixed(2) + '%');

        // 3. Populate the EV Population Table
        let tableBody = '';
        data.forEach(row => {
            tableBody += `<tr>
                <td>${row.County}</td>
                <td>1</td> <!-- Placeholder for actual EV population data -->
                <td>${row['Model Year']}</td>
            </tr>`;
        });
        $('#ev-table tbody').html(tableBody);

        // Initialize DataTables for pagination and sorting
        $('#ev-table').DataTable({
            paging: true,           // Enable pagination
            searching: true,        // Enable searching
            ordering: true,         // Enable sorting
            info: true,             // Show table info (total records)
            pageLength: 10,         // Default number of rows per page
            lengthMenu: [10, 25, 50, 100]  // Options for number of rows per page
        });

        // 4. Create EV Population Chart
        const labels = [...new Set(data.map(row => row['Model Year']))];
        const evPopulationData = labels.map(year => {
            return data.filter(row => row['Model Year'] === year).length; // Count the number of EVs for each year
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
