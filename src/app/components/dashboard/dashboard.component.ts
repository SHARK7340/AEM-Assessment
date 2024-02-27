import { Component, OnInit, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {
  public dashboarData: any = [];
  private pieChart: am4charts.PieChart3D = new am4charts.PieChart3D;
  private barChart: am4charts.XYChart3D = new am4charts.XYChart3D;

  constructor(@Inject(PLATFORM_ID) private platformId: any, private zone: NgZone, private auth: AuthService, private api: ApiService) { }

  ngOnInit(): void {
    this.api.getDashboard()
      .subscribe(res => {
        // console.log("res: " , res);
        this.dashboarData = res.success ? res : {};

        am4core.useTheme(am4themes_animated);
        this.createPieChart(res.chartDonut ? res.chartDonut : []);
        this.create3DbarChart(res.chartBar ? res.chartBar : []);
      })
  }

  logout() {
    this.auth.logout();
  }

  createPieChart(dataChartDonut: any) {
    let pieChart = am4core.create("piechartdiv", am4charts.PieChart3D);

    // Add data
    pieChart.data = dataChartDonut;

    // Add and configure Series
    var pieSeries = pieChart.series.push(new am4charts.PieSeries3D());
    pieSeries.dataFields.value = "value";
    pieSeries.dataFields.category = "name";

    // Let's cut a hole in our Pie chart the size of 40% the radius
    pieChart.innerRadius = am4core.percent(40);

    // Disable ticks and labels
    // default false
    // pieSeries.labels.template.disabled = true;
    // pieSeries.ticks.template.disabled = true;

    // Disable tooltips
    // pieSeries.slices.template.tooltipText = "";

    // Put a thick white border around each Slice
    // pieSeries.slices.template.stroke = am4core.color("#4a2abb");
    pieSeries.slices.template.stroke = am4core.color("#f7f7f7");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // Add a legend
    pieChart.legend = new am4charts.Legend();

    this.pieChart = pieChart;
  }

  create3DbarChart(dataChartBar: any) {
    // Create chart instance
    let bar3DChart = am4core.create("bar3Dchartdiv", am4charts.XYChart3D);

    // Add data
    bar3DChart.data = dataChartBar;

    // Create axes
    var categoryAxis = bar3DChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.title.text = "Bar Type";
    // to show all x-axis label
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis = bar3DChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Value";
    // Create series
    var series = bar3DChart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "name";
    series.name = "Bar";
    series.tooltipText = "{name}: [bold]{valueY}[/]";
    // Add cursor
    bar3DChart.cursor = new am4charts.XYCursor();
    // Add a legend
    // bar3DChart.legend = new am4charts.Legend();
    this.barChart = bar3DChart;
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // ngAfterViewInit() {
  //   // Chart code goes in here
  //   this.browserOnly(() => {

  //   });
  // }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.pieChart) {
        this.pieChart.dispose();
      }

      if (this.barChart) {
        this.barChart.dispose();
      }
    });
  }
}
