JSONArray rows = new JSONArray();
Category cat = new Category();
ResultSet rs = null;
try{
    Connection con = getConnection();
    PreparedStatement ps = con.prepareStatement("SELECT cat_id FROM category");
    rs = ps.executeQuery();
    while(rs.next()){
        JSONObject row1_col1_val = new JSONObject();
        row1_col1_var1.put("v",Category.getName(rs.getInt()));
        JSONObject row1_col2_val = new JSONObject();
        row1_col2_val.put("v",rs.getInt("total"));
    }
    con.close();
}
catch(Exception e){}
data.put("rows",rows);