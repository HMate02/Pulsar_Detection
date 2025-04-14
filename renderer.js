document.querySelector(".detect-button").addEventListener("click", () => {
    const model_name = document.querySelector(".model").value;
    const sampling = document.querySelector(".sampling").value;
    const model_type = document.querySelector(".baseline-stack").value;

    const loading = document.querySelector(".loading");
    const output = document.querySelector(".output");

    output.innerHTML = "";
    loading.style.display = "block";

    fetch("https://pulsar-detection-api.onrender.com/predict_model", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            model_type : model_type,
            model_name : model_name,
            sampling : sampling
        })
    })
    .then(res => res.json())
    .then(data => {
        const matrix = data.confusion_matrix;
        const confmatrix = 
        `
            Confusion matrix:<br>
            <span class="conf-matrix">
                [[${matrix[0][0]} <span style="margin-left: 0.75rem;"></span> ${matrix[0][1]}]<br>
                [<span style="margin-left: 1rem;"></span>${matrix[1][0]} <span style="margin-left: 0.75rem;"></span> ${matrix[1][1]}]]
            </span>
        `;
        
        const result = `
            Eredmények:<br>
            Accuracy: ${(data.accuracy*100).toFixed(2)}%<br>
            AUC: ${(data.auc*100).toFixed(2)}%<br>
            F1-score: ${(data.f1*100).toFixed(2)}%<br>
            Precision: ${(data.precision*100).toFixed(2)}%<br>
            Recall-score: ${(data.recall*100).toFixed(2)}%<br>
            ${confmatrix}
        `;

        output.innerHTML = result;
    })
    .catch(err => {
        document.querySelector(".output").innerHTML = "Model couldn't be loaded! Try again!";
        console.error("API call failed!");
    })
    .finally(() => {
        loading.style.display = "none";
    });
})