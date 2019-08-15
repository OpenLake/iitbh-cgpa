chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

	chrome.tabs.executeScript(tabs[0].id, {
		file: 'contentscript.js'
	}, function () {

			chrome.tabs.sendMessage(tabs[0].id, 'cgpa', function (response) {
				if (response) {
					var sum=0;
					var parent = document.getElementById('cgpas');
					var arr=response.cgpa;
					var n=arr.length;
					for(var i=n-1;i>=0;i--)
					{
						var element=arr[i];
						var child = document.createElement('div');
						sum=sum+element;
						child.textContent = "Semester " +(n-i).toString() +": " + element;
						parent.appendChild(child);


					}
					var parent = document.getElementById('cgpas');
					var child = document.createElement('div');
					console.log(sum);
					child.textContent = "Total CGPA : " + (sum/n);
					parent.appendChild(child);


				}
				else {
					document.getElementById('cgpa').textContent = 'Some error occured';
				}

			});

		});
});
