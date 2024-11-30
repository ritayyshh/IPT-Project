using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RestaurantReservation.Migrations
{
    /// <inheritdoc />
    public partial class OrderRelationsUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "2293338c-02cb-47f4-bc8e-52218889caeb");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5d463b54-2440-4fd6-9565-a8cd5db69d51");

            migrationBuilder.AddColumn<int>(
                name: "ReservationID",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TableID",
                table: "Orders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "0110448f-f991-43c2-8f13-f214b8e22d8a", null, "Admin", "ADMIN" },
                    { "bd1d549d-738c-48de-9e3b-6b40aded2924", null, "User", "USER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "0110448f-f991-43c2-8f13-f214b8e22d8a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bd1d549d-738c-48de-9e3b-6b40aded2924");

            migrationBuilder.DropColumn(
                name: "ReservationID",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TableID",
                table: "Orders");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "2293338c-02cb-47f4-bc8e-52218889caeb", null, "Admin", "ADMIN" },
                    { "5d463b54-2440-4fd6-9565-a8cd5db69d51", null, "User", "USER" }
                });
        }
    }
}
